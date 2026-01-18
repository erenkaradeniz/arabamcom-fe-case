import { ref } from 'vue'

export function useParallax() {
  const transformStyle = ref({})
  let rafId: number | null = null

  const handleMouseMove = (e: MouseEvent) => {
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
