import type { useUIStore } from '@/stores/ui'
import { PaginationMode, ViewMode } from '@/types'
import { useMediaQuery } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

export const useResponsiveLayout = (uiStore: ReturnType<typeof useUIStore>) => {
  const { viewMode, paginationMode } = storeToRefs(uiStore)
  const isLargeScreen = useMediaQuery('(min-width: 1600px)')

  const activeViewMode = computed(() => {
    if (!isLargeScreen.value) return ViewMode.Grid
    return viewMode.value
  })

  const activePaginationMode = computed(() => {
    if (!isLargeScreen.value) return PaginationMode.Scroll
    return paginationMode.value
  })

  return {
    isLargeScreen,
    activeViewMode,
    activePaginationMode,
  }
}
