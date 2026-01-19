import { unrefElement } from '@vueuse/core'
import { onUnmounted, ref, watch, type ComponentPublicInstance, type Ref } from 'vue'

interface UseElementVisibilityOptions {
  threshold?: number | number[]
  rootMargin?: string
  root?: Element | Document | null
}

export function useElementVisibility(
  target: Ref<HTMLElement | ComponentPublicInstance | null | undefined>,
  options: UseElementVisibilityOptions = {}
) {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const setupObserver = () => {
    cleanup()

    const el = unrefElement(target)
    if (!el) return

    observer = new IntersectionObserver(
      (entries) => {
        isVisible.value = entries[0]?.isIntersecting ?? false
      },
      {
        threshold: options.threshold ?? 0.1,
        rootMargin: options.rootMargin,
        root: options.root,
      }
    )

    observer.observe(el)
  }

  watch(
    target,
    () => {
      setupObserver()
    },
    { flush: 'post' }
  )

  onUnmounted(() => {
    cleanup()
  })

  return {
    isVisible,
    cleanup,
  }
}
