import { onKeyStroke, useScrollLock } from '@vueuse/core'
import { ref, watch } from 'vue'

export interface GalleryOptions {
  loop?: boolean
  enableKeyboard?: boolean
}

export const useGallery = (totalItems: () => number, options: GalleryOptions = {}) => {
  const { loop = true, enableKeyboard = true } = options

  const activeIndex = ref(0)
  const isOpen = ref(false)

  const isLocked = useScrollLock(document.body)

  watch(isOpen, (val) => {
    isLocked.value = val
  })

  const next = () => {
    const total = totalItems()
    if (total <= 0) return

    if (activeIndex.value < total - 1) {
      activeIndex.value++
    } else if (loop) {
      activeIndex.value = 0
    }
  }

  const prev = () => {
    const total = totalItems()
    if (total <= 0) return

    if (activeIndex.value > 0) {
      activeIndex.value--
    } else if (loop) {
      activeIndex.value = total - 1
    }
  }

  const open = (index = 0) => {
    activeIndex.value = index
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  if (enableKeyboard) {
    onKeyStroke('ArrowRight', (e) => {
      if (isOpen.value) {
        e.preventDefault()
        next()
      }
    })

    onKeyStroke('ArrowLeft', (e) => {
      if (isOpen.value) {
        e.preventDefault()
        prev()
      }
    })

    onKeyStroke('Escape', (e) => {
      if (isOpen.value) {
        e.preventDefault()
        close()
      }
    })
  }

  return {
    activeIndex,
    isOpen,
    next,
    prev,
    open,
    close,
  }
}
