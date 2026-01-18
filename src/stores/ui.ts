import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', () => {
  const viewMode = ref<'grid' | 'list'>('grid')
  const paginationMode = ref<'scroll' | 'pagination'>('scroll')

  const isFilterModalOpen = ref(false)

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  const togglePaginationMode = () => {
    paginationMode.value = paginationMode.value === 'scroll' ? 'pagination' : 'scroll'
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
    openFilterModal,
    closeFilterModal,
  }
})
