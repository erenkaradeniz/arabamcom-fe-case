import { useRouter } from 'vue-router'

export const useAppNavigation = () => {
  const router = useRouter()

  const goBack = () => {
    router.back()
  }

  const returnToHome = () => {
    router.push({ name: 'home' })
  }

  return {
    goBack,
    returnToHome,
  }
}
