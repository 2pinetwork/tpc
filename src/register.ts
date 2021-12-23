import readlineSync from 'readline-sync'
import { ApiKey, User } from './apiKey'
import config from '../config.json'
import confirmUser from './confirm'
import { handleResponse, post, validateStatus } from './helpers/request'

type Account = {
  name:        string,
  memberships: Array<{ user: User }>
}

const postAccount = async (account: Account, devMode: boolean): Promise<boolean> => {
  try {
    const path        = config.accountsPath
    const axiosConfig = { validateStatus: validateStatus(422) }
    const response    = await post(path, { account }, axiosConfig, devMode)

    return handleResponse(201, 422, response)
  } catch (error) {
    console.error(error)

    return false
  }
}

const getAccount = (): Account => {
  const name = readlineSync.question('Organization: ')

  return { name, memberships: [] }
}

const registerUser = async (
  account: Account,
  devMode: boolean
): Promise<User | boolean> => {
  const user: User = {}
  const questions  = {
    name:                  ['Full name: ',             false],
    email:                 ['Email: ',                 false],
    password:              ['Password: ',              true],
    password_confirmation: ['Password confirmation: ', true]
  }

  for (const [attribute, [text, muted]] of Object.entries(questions)) {
    const options = { hideEchoBack: !!muted, mask: '' }

    user[attribute] = readlineSync.question(text, options)
  }

  account.memberships.push({ user })

  return (await postAccount(account, devMode)) && user
}

const registration = async (devMode: boolean): Promise<ApiKey | undefined> => {
  const account = getAccount()
  const user    = await registerUser(account, devMode)

  return user ? (await confirmUser(user as User, devMode)) : undefined
}

export default registration
