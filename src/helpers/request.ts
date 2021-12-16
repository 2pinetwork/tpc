import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import getEndpoint from './endpoint'

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
