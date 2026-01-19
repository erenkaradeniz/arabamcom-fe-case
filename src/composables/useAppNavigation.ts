import { useRouter } from 'vue-router'

export const useAppNavigation = () => {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const returnToHome = () => {
    if (window.history.state?.back) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return {
    goBack,
    returnToHome,
  }
}
