#!/usr/bin/env node

import command from './src/command'
import createApp from './src/create'
import getEndpoint from './src/endpoint'
import { checkApiKey, getApiKey } from './src/keys'
import configWallet from './src/wallet'

const { program, projectPath } = command()
const options                  = program.opts()

const main = async () => {
  const key   = await getApiKey({ key: options.key, secret: options.secret })
  const valid = await checkApiKey(key, options.development)

  if (valid) {
    const endpoint                           = getEndpoint(options.development)
    const walletOptions                      = { mnemonic: options.mnemonic }
    const { address, mnemonic }              = configWallet(walletOptions)
    const { key: apiKey, secret: apiSecret } = key

    createApp(projectPath, { address, mnemonic, endpoint, apiKey, apiSecret })
  } else {
    throw new Error('Invalid API key, please check the values and try again')
  }
}

main().then(() => {
  process.exit(0)
}).catch(error => {
  console.error(error)

  process.exit(1)
})
