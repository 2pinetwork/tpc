import { OptionValues } from 'commander'
import confirmUser from '../confirm'
import { getWallet } from '../wallet'

const processConfirmation = async (options: OptionValues) => {
  const walletOptions = { mnemonic: options.mnemonic }
  const key           = await confirmUser(undefined, options.development)
  const wallet        = key && (await getWallet(walletOptions))

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

export default processConfirmation
