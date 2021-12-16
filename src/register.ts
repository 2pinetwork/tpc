import readlineSync from 'readline-sync'
import config from '../config.json'
import { handleResponse, patch, post, validateStatus } from './helpers/request'
import { getAuthToken } from './helpers/session'

type ApiKey = { key: string, secret: string }
type User   = { [attribute: string]: string }

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

const patchConfirmation = async (token: string, devMode: boolean): Promise<boolean> => {
  try {
    const path        = `${config.confirmationsPath}/${token}`
    const axiosConfig = { validateStatus: validateStatus(404) }
    const response    = await patch(path, {}, axiosConfig, devMode)

    return handleResponse(204, 404, response)
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

const confirmUser = async (devMode: boolean): Promise<boolean> => {
  const confirmationToken = readlineSync.question(
    'Check your email and paste the confirmation token received here: '
  )

  return await patchConfirmation(confirmationToken, devMode)
}

const createApiKey = async (user: User, devMode: boolean): Promise<ApiKey> => {
  const { email, password } = user
  const token       = await getAuthToken({ email, password }, devMode)
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

const registration = async (devMode: boolean): Promise<ApiKey | undefined> => {
  const user      = await registerUser(devMode)
  const confirmed = user && (await confirmUser(devMode))

  if (confirmed) {
    const apiKey = await createApiKey(user as User, devMode)

    return apiKey
  }
}

export default registration
