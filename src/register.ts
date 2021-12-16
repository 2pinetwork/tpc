import readlineSync from 'readline-sync'
import { ApiKey, User } from './apiKey'
import config from '../config.json'
import confirmUser from './confirm'
import { handleResponse, post, validateStatus } from './helpers/request'

const postUser = async (user: User, devMode: boolean): Promise<boolean> => {
  try {
    const path        = config.usersPath
    const axiosConfig = { validateStatus: validateStatus(422) }
    const response    = await post(path, { user }, axiosConfig, devMode)

    return handleResponse(201, 422, response)
  } catch (error) {
    console.error(error)

    return false
  }
}

const registerUser = async (devMode: boolean): Promise<User | boolean> => {
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

  return (await postUser(user, devMode)) && user
}

const registration = async (devMode: boolean): Promise<ApiKey | undefined> => {
  const user = await registerUser(devMode)

  return user ? (await confirmUser(user as User, devMode)) : undefined
}

export default registration
