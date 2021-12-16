import readlineSync from 'readline-sync'
import config from '../config.json'
import { ApiKey } from './apiKey'
import { post, validateStatus } from './helpers/request'

export const getApiKey = async (
  { key, secret }: { key: string | undefined, secret: string | undefined }
): Promise<ApiKey> => {
  if (key && secret) {
    return { key, secret }
  } else {
    const result    = { key: '', secret: '' }
    const questions = {
      key:    'Please provide your API key: ',
      secret: 'Please provide your API secret: '
    }

    result.key    = key    || readlineSync.question(questions.key)
    result.secret = secret || readlineSync.question(questions.secret, {
      hideEchoBack: true
    })

    return result
  }
}

export const getApiKeyAuthToken = async (
  apiKey:  ApiKey,
  devMode: boolean
): Promise<string | undefined> => {
  const path        = config.sessionsPath
  const axiosConfig = { validateStatus: validateStatus(401) }
  const response    = await post(path, apiKey, axiosConfig, devMode)

  return response.status === 200 ? response.data.data.token : undefined
}
