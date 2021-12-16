import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import getEndpoint from './endpoint'
import showErrors from './errors'

export const validateStatus = (expected: number) => {
  return (status: number) => status < 400 || status === expected
}

export const handleResponse = (
  successStatus: number,
  errorStatus:   number,
  response:      AxiosResponse
): boolean => {
  if (response.status === errorStatus) {
    showErrors(response.data.errors)

    return false
  } else {
    return response.status === successStatus
  }
}

export const get = async (
  path:     string,
  config?:  AxiosRequestConfig,
  devMode?: boolean
): Promise<AxiosResponse> => {
  const endpoint = getEndpoint(devMode)

  return await axios.get(`${endpoint}/${path}`, config)
}

export const post = async (
  path:     string,
  data:     Record<string, unknown>,
  config?:  AxiosRequestConfig,
  devMode?: boolean
): Promise<AxiosResponse> => {
  const endpoint = getEndpoint(devMode)

  return await axios.post(`${endpoint}/${path}`, data, config)
}

export const patch = async (
  path:     string,
  data:     Record<string, unknown>,
  config?:  AxiosRequestConfig,
  devMode?: boolean
): Promise<AxiosResponse> => {
  const endpoint = getEndpoint(devMode)

  return await axios.patch(`${endpoint}/${path}`, data, config)
}
