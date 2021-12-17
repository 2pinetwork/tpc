import readlineSync from 'readline-sync'
import { Wallet } from 'ethers'
import { ApiKey } from './apiKey'
import { getApiKeyAuthToken } from './helpers/session'
import config from '../config.json'
import { handleResponse, post, validateStatus } from './helpers/request'

type Mnemonic = {
  mnemonic: Array<string> | undefined
}

const fromMnemonic = (mnemonic: Array<string>) => {
  return Wallet.fromMnemonic(mnemonic.join(' '))
}

const postWallet = async (key: ApiKey, { address }: Record<string, unknown>, devMode: boolean) => {
  const token       = await getApiKeyAuthToken(key, devMode)
  const headers     = { 'Authorization': `Bearer ${token}` }
  const axiosConfig = { headers, validateStatus: validateStatus(422) }
  const data        = { wallet: { name: 'Default', address } }
  const response    = await post(config.walletsPath, data, axiosConfig, devMode)

  if (! handleResponse(201, 422, response)) {
    console.error('Wallet can\'t be registered')
    process.exit(1)
  }
}

export const createRandomWallet = () => {
  return Wallet.createRandom()
}

export const getWallet = async (key: ApiKey, { mnemonic }: Mnemonic, devMode: boolean) => {
  let result

  if (mnemonic) {
    const wallet = fromMnemonic(mnemonic)

    result = { address: wallet.address, mnemonic: wallet.mnemonic.phrase }
  } else {
    const message = 'A crypto wallet is required to interact with our protocol. Do you want to use an existing wallet or create a new one locally?'
    const options = ['Use an existing wallet', 'Create a new one locally']
    const option  = readlineSync.keyInSelect(options, message, { cancel: false })

    if (option) {
      result = configWallet({ mnemonic: undefined })
    } else {
      const address = readlineSync.question('Please provide the public address of your wallet: ')

      result = { address, mnemonic: null }
    }
  }

  await postWallet(key, result, devMode)

  return result
}

export const configWallet = ({ mnemonic }: Mnemonic) => {
  let wallet

  if (mnemonic) {
    wallet = fromMnemonic(mnemonic)
  } else {
    wallet = createRandomWallet()
  }

  const { address } = wallet
  const { phrase }  = wallet.mnemonic

  return { address, mnemonic: phrase }
}
