import { useMediaQuery } from '@vueuse/core'
import { ref, watch } from 'vue'

export function useParallax() {
  const transformStyle = ref({})
  const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  let rafId: number | null = null

  watch(
    isReducedMotion,
    (val) => {
      if (val) {
        if (rafId) {
          window.cancelAnimationFrame(rafId)
          rafId = null
        }
        transformStyle.value = {
          transform: 'scale(1)',
          transition: 'transform 0s',
        }
      } else {
        rafId = null
      }
    },
    { immediate: true }
  )

  const handleMouseMove = (e: MouseEvent) => {
    if (isReducedMotion.value) return
    const target = e.currentTarget as HTMLElement
    const { left, top, width, height } = target.getBoundingClientRect()
    const { clientX, clientY } = e

    if (rafId) return

    rafId = window.requestAnimationFrame(() => {
      const x = (clientX - left) / width
      const y = (clientY - top) / height

      const moveX = (0.5 - x) * 20
      const moveY = (0.5 - y) * 20

      transformStyle.value = {
        transform: `scale(1.1) translate(${moveX}px, ${moveY}px)`,
        transition: 'transform 0.1s ease-out',
      }
      rafId = null
    })
  }

  const handleMouseLeave = () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId)
      rafId = null
    }
    transformStyle.value = {
      transform: 'scale(1)',
      transition: 'transform 0.5s ease-out',
    }
  }

  return {
    transformStyle,
    handleMouseMove,
    handleMouseLeave,
  }
}
