import { OptionValues } from 'commander'
import getEndpoint from '../helpers/endpoint'
import createApp from '../create'
import { getApiKeyAuthToken, getApiKey } from '../checkApiKey'
import { configWallet } from '../wallet'

const processCreateApp = async (project: string, options: OptionValues) => {
  const walletOptions = { mnemonic: options.mnemonic }
  const keyOptions    = { key: options.key, secret: options.secret }
  const key           = await getApiKey(keyOptions)
  const token         = await getApiKeyAuthToken(key, options.development)

  if (token) {
    const endpoint                           = getEndpoint(options.development)
    const { address, mnemonic }              = configWallet(walletOptions)
    const { key: apiKey, secret: apiSecret } = key

    createApp(project, { address, mnemonic, endpoint, apiKey, apiSecret })
  } else {
    throw new Error('Invalid API key, please check the values and try again')
  }
}

export default processCreateApp
