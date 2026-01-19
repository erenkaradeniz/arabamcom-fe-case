import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  const viewMode = useStorage<'grid' | 'list'>('ui-view-mode', 'grid')
  const paginationMode = useStorage<'scroll' | 'pagination'>('ui-pagination-mode', 'scroll')

  const isFilterModalOpen = ref(false)

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  const togglePaginationMode = () => {
    paginationMode.value = paginationMode.value === 'scroll' ? 'pagination' : 'scroll'
  }

  const setPaginationMode = (mode: 'scroll' | 'pagination') => {
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
    toggleViewMode,
    togglePaginationMode,
    setPaginationMode,
    openFilterModal,
    closeFilterModal,
  }
})
