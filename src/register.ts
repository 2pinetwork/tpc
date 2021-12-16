import readlineSync from 'readline-sync'
import config from '../config.json'
import { patch, post } from './helpers/request'
import { getAuthToken } from './helpers/session'

type ApiKey = { key: string, secret: string }
type User   = { [attribute: string]: string }

const postUser = async (user: User, devMode: boolean): Promise<boolean> => {
  try {
    const response = await post(config.usersPath, { user }, {}, devMode)

    return response.status === 201
  } catch (error) {
    console.error(error)

    return false
  }
}

const patchConfirmation = async (token: string, devMode: boolean): Promise<boolean> => {
  try {
    const path     = `${config.confirmationsPath}/${token}`
    const response = await patch(path, {}, {}, devMode)

    return response.status === 204
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
    user[attribute] = readlineSync.question(text, { hideEchoBack: !!muted })
  }

  return (await postUser(user, devMode)) && user
}

const confirmUser = async (devMode: boolean): Promise<boolean> => {
  const confirmationToken = readlineSync.question(
    'Check your email and paste the confirmation token received here: '
  )

  return await patchConfirmation(confirmationToken, devMode)
}

const createApiKey = async (user: User, devMode: boolean): Promise<ApiKey> => {
  const { email, password } = user
  const token    = await getAuthToken({ email, password }, devMode)
  const data     = { api_key: { name: 'Default', enabled: true } }
  const headers  = { 'Authorization': `Bearer ${token}` }
  const response = await post(config.apiKeysPath, data, { headers }, devMode)

  return {
    key:    response.data.data.key,
    secret: response.data.data.secret
  }
}

const registration = async (devMode: boolean): Promise<ApiKey | undefined> => {
  const user      = await registerUser(devMode)
  const confirmed = user && (await confirmUser(devMode))

  if (confirmed) {
    const apiKey = await createApiKey(user as User, devMode)

    return apiKey
  }
}

export default registration
