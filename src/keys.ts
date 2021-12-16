import readlineSync from 'readline-sync'
import config from '../config.json'
import { post } from './helpers/request'

type ApiKey = { key: string, secret: string }

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

export const checkApiKey = async (apiKey: ApiKey, devMode: boolean): Promise<boolean> => {
  try {
    const response = await post(config.sessionsPath, apiKey, {}, devMode)

    return response.status === 200
  } catch (error) {
    console.error(error)

    return false
  }
}
