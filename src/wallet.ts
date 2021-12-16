import readlineSync from 'readline-sync'
import { Wallet } from 'ethers'

const fromMnemonic = (mnemonic: Array<string>) => {
  return Wallet.fromMnemonic(mnemonic.join(' '))
}

export const createRandomWallet = () => {
  return Wallet.createRandom()
}

export const getWallet = ({ mnemonic } : { mnemonic: Array<string> | undefined }) => {
  if (mnemonic) {
    const wallet = fromMnemonic(mnemonic)

    return { address: wallet.address, mnemonic: wallet.mnemonic.phrase }
  } else {
    const message = 'A crypto wallet is required to interact with our protocol. Do you want to use an existing wallet or create a new one locally?'
    const options = ['Use an existing wallet', 'Create a new one locally']
    const option  = readlineSync.keyInSelect(options, message, { cancel: false })

    if (option) {
      return configWallet({ mnemonic: undefined })
    } else {
      const address = readlineSync.question('Please provide the public address of your wallet: ')

      return { address, mnemonic: null }
    }
  }
}

export const configWallet = ({ mnemonic } : { mnemonic: Array<string> | undefined }) => {
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
