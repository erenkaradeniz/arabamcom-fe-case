import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'
import type { ApiValidationError } from '@/types'

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
    if (error.response) {
      const { status, data } = error.response

      if (status === 400 && data.errors) {
        const errorMessages = (Object.entries(data.errors) as [string, string[]][])
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join('\n')

        console.warn('⚠️ Validation Error:\n', errorMessages)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
