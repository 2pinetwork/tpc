import { OptionValues } from 'commander'
import registration from '../register'
import { getWallet } from '../wallet'

const processRegistration = async (options: OptionValues) => {
  const walletOptions = { mnemonic: options.mnemonic }
  const devMode       = options.development
  const key           = await registration(devMode)
  const wallet        = key && (await getWallet(key, walletOptions, devMode))

  if (key) {
    console.log('Your API key', key.key)
    console.log('Your API secret', key.secret)
  }

  if (wallet?.address) {
    console.log('Your wallet public address', wallet.address)
  }

  if (wallet?.mnemonic) {
    console.log('Your Mnemonic', wallet.mnemonic)
    console.log('(Make sure you write down and keep your mnemonic in a safe place. We don\'t keep record of it anywhere.)')
  }
}

export default processRegistration
