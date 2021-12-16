import readlineSync from 'readline-sync'
import config from '../config.json'
import { handleResponse, patch, validateStatus } from './helpers/request'
import createApiKey, { ApiKey, User } from './apiKey'

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

const confirmUser = async (user: User | undefined, devMode: boolean): Promise<ApiKey | undefined> => {
  const confirmationToken = readlineSync.question(
    'Check your email and paste the confirmation token received here: '
  )

  const confirmed = await patchConfirmation(confirmationToken, devMode)

  if (confirmed) {
    const apiKey = await createApiKey(user, devMode)

    return apiKey
  }
}

export default confirmUser
