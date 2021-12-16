import readlineSync from 'readline-sync'
import config from '../config.json'
import { handleResponse, post, validateStatus } from './helpers/request'
import { getAuthToken } from './helpers/session'

export type ApiKey = { key: string, secret: string }
export type User   = { [attribute: string]: string }

const authTokenFor = async (user: User, devMode: boolean): Promise<string> => {
  const { email, password } = user

  return await getAuthToken({ email, password }, devMode)
}

const getUser = (): User => {
  const user: User = {}
  const questions  = {
    email:    ['Email: ',    false],
    password: ['Password: ', true]
  }

  console.log('Great! We can now generate you API key, please provide your credentials:')

  for (const [attribute, [text, muted]] of Object.entries(questions)) {
    const options = { hideEchoBack: !!muted, mask: '' }

    user[attribute] = readlineSync.question(text, options)
  }

  return user
}

const createApiKey = async (user: User | undefined, devMode: boolean): Promise<ApiKey> => {
  const token       = await authTokenFor(user || getUser(), devMode)
  const data        = { api_key: { name: 'Default', enabled: true } }
  const headers     = { 'Authorization': `Bearer ${token}` }
  const axiosConfig = { headers, validateStatus: validateStatus(422) }
  const response    = await post(config.apiKeysPath, data, axiosConfig, devMode)

  if (handleResponse(201, 422, response)) {
    return {
      key:    response.data.data.key,
      secret: response.data.data.secret
    }
  } else {
    return { key: '', secret: '' }
  }
}

export default createApiKey
