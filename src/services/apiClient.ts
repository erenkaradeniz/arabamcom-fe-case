import type { ApiValidationError } from '@/types'
import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public messageKey: string,
    public isRetryable: boolean = false
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data
  },
  (error: AxiosError<ApiValidationError>) => {
    if (!error.response) {
      return Promise.reject(
        new ApiError('Network error', 0, 'NETWORK_ERROR', 'api_error.network', true)
      )
    }

    const { status, data } = error.response

    if (status >= 400 && status < 500) {
      let messageKey = 'api_error.generic'
      let code = 'CLIENT_ERROR'
      let message = 'Client error'

      if (status === 400 && data?.errors) {
        const errorMessages = (Object.entries(data.errors) as [string, string[]][])
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')
        message = errorMessages
        messageKey = 'api_error.validation'
        code = 'VALIDATION_ERROR'
        console.warn('⚠️ Validation Error:\n', errorMessages)
      } else if (status === 401) {
        messageKey = 'api_error.unauthorized'
        code = 'UNAUTHORIZED'
      } else if (status === 403) {
        messageKey = 'api_error.forbidden'
        code = 'FORBIDDEN'
      } else if (status === 404) {
        messageKey = 'api_error.not_found'
        code = 'NOT_FOUND'
      }

      return Promise.reject(new ApiError(message, status, code, messageKey, false))
    }

    if (status >= 500) {
      let messageKey = 'api_error.server'
      let code = 'SERVER_ERROR'

      if (status === 503) {
        messageKey = 'api_error.service_unavailable'
        code = 'SERVICE_UNAVAILABLE'
      }

      return Promise.reject(new ApiError('Server error', status, code, messageKey, true))
    }

    return Promise.reject(error)
  }
)

export default apiClient
