import { PaginationMode, ViewMode } from '@/types'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const viewMode = useStorage<ViewMode>('ui-view-mode', ViewMode.Grid)
  const paginationMode = useStorage<PaginationMode>('ui-pagination-mode', PaginationMode.Pagination)

  const isFilterModalOpen = ref(false)

  const setPaginationMode = (mode: PaginationMode) => {
    paginationMode.value = mode
  }

  const openFilterModal = () => {
    isFilterModalOpen.value = true
  }

  const closeFilterModal = () => {
    isFilterModalOpen.value = false
  }

  return {
    viewMode,
    paginationMode,
    isFilterModalOpen,
    setPaginationMode,
    openFilterModal,
    closeFilterModal,
  }
})
