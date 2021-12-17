import { handleResponse, post, validateStatus } from './request'
import config from '../../config.json'
import { ApiKey } from '../apiKey'

type User = { email: string, password: string }

export const getAuthToken = async (user: User, devMode: boolean): Promise<string> => {
  const path        = config.sessionsPath
  const data        = { email: user.email, password: user.password }
  const axiosConfig = { validateStatus: validateStatus(401) }
  const response    = await post(path, data, axiosConfig, devMode)

  if (handleResponse(200, 401, response) && response.status === 200) {
    const { token } = response.data.data

    return token
  } else {
    process.exit(1)
  }
}

export const getApiKeyAuthToken = async (
  apiKey:  ApiKey,
  devMode: boolean
): Promise<string | undefined> => {
  const path        = config.sessionsPath
  const axiosConfig = { validateStatus: validateStatus(401) }
  const response    = await post(path, apiKey, axiosConfig, devMode)

  if (handleResponse(200, 401, response) && response.status === 200) {
    const { token } = response.data.data

    return token
  }
}
