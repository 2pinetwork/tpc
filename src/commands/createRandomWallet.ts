import { createRandomWallet } from '../wallet'

const processCreateRandomWallet = () => {
  const { address, mnemonic } = createRandomWallet()

  console.log('Your wallet public address:', address)

  console.log('Your Mnemonic:', mnemonic.phrase)
  console.log('(Make sure you write down and keep your mnemonic in a safe place. We don\'t keep record of it anywhere.)')
}

export default processCreateRandomWallet
