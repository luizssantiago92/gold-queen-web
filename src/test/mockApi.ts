import { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

import { api } from '@/lib/api'

export interface MockResult {
  status: number
  data: unknown
}

export function installApiMock(
  handler: (config: InternalAxiosRequestConfig) => MockResult,
): () => void {
  const previous = api.defaults.adapter
  api.defaults.adapter = async (config) => {
    const result = handler(config)
    const response: AxiosResponse = {
      data: result.data,
      status: result.status,
      statusText: String(result.status),
      headers: {},
      config,
    }
    if (result.status >= 400) {
      throw new AxiosError(
        `Request failed with status code ${result.status}`,
        AxiosError.ERR_BAD_REQUEST,
        config,
        undefined,
        response,
      )
    }
    return response
  }

  return () => {
    api.defaults.adapter = previous
  }
}

export function headerValue(config: InternalAxiosRequestConfig, name: string): string | undefined {
  const value = config.headers.get(name)
  return value == null ? undefined : String(value)
}
