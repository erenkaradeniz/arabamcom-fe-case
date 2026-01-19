import { ref } from 'vue'

const error = ref<unknown>(null)

export function useGlobalError() {
  const setError = (err: unknown) => {
    error.value = err
  }

  const clearError = () => {
    error.value = null
  }

  return {
    error,
    setError,
    clearError,
  }
}
