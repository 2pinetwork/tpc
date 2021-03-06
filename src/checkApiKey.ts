import readlineSync from 'readline-sync'
import { ApiKey } from './apiKey'

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
