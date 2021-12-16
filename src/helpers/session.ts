import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import getEndpoint from './endpoint'
import config from '../../config.json'

type User = { email: string, password: string }

export const getAuthToken = async (user: User, devMode: boolean): Promise<string> => {
  const endpoint = getEndpoint(devMode)
  const url      = `${endpoint}/${config.sessionsPath}`
  const response = await axios.post(url, {
    email:    user.email,
    password: user.password
  })

  if (response.status === 200) {
    const { token } = response.data.data

    return token
  } else {
    throw new Error(`Authentication failed, response status was ${response.status} (expecting 200)`)
  }
}

