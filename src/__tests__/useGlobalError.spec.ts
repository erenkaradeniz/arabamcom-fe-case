import { useGlobalError } from '@/composables/useGlobalError'
import { describe, expect, it } from 'vitest'

describe('useGlobalError', () => {
  it('should start with no error', () => {
    const { error } = useGlobalError()
    expect(error.value).toBeNull()
  })

  it('should set error', () => {
    const { error, setError } = useGlobalError()
    const testError = new Error('Test Error')

    setError(testError)
    expect(error.value).toBe(testError)
  })

  it('should clear error', () => {
    const { error, setError, clearError } = useGlobalError()
    const testError = new Error('Test Error')

    setError(testError)
    expect(error.value).toBe(testError)

    clearError()
    expect(error.value).toBeNull()
  })
})
