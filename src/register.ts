import readlineSync from 'readline-sync'
import { ApiKey, User } from './apiKey'
import config from '../config.json'
import confirmUser from './confirm'
import { handleResponse, post, validateStatus } from './helpers/request'

type Account = {
  name: string
}

const postUser = async (account: Account, user: User, devMode: boolean): Promise<boolean> => {
  try {
    const path        = config.accountsPath
    const axiosConfig = { validateStatus: validateStatus(422) }
    const params      = { account, user }
    const response    = await post(path, params, axiosConfig, devMode)

    return handleResponse(201, 422, response)
  } catch (error) {
    console.error(error)

    return false
  }
}

const getAccount = (): Account => {
  const name = readlineSync.question('Organization name: ')

  return { name }
}

const registerUser = async (
  account: Account,
  devMode: boolean
): Promise<User | boolean> => {
  const user: User = {}
  const questions  = {
    name:                  ['Name: ',                  false],
    lastname:              ['Last name: ',             false],
    email:                 ['Email: ',                 false],
    password:              ['Password: ',              true],
    password_confirmation: ['Password confirmation: ', true]
  }

  for (const [attribute, [text, muted]] of Object.entries(questions)) {
    const options = { hideEchoBack: !!muted, mask: '' }

    user[attribute] = readlineSync.question(text, options)
  }

  return (await postUser(account, user, devMode)) && user
}

const registration = async (devMode: boolean): Promise<ApiKey | undefined> => {
  const account = getAccount()
  const user    = await registerUser(account, devMode)

  return user ? (await confirmUser(user as User, devMode)) : undefined
}

export default registration
