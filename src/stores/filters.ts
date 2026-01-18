import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type AdvertQueryParams, SortType, SortDirection } from '@/types'

export const useFilterStore = defineStore('filters', () => {
  const filters = ref<AdvertQueryParams>({
    take: 20,
    skip: 0,
    sort: SortType.Date,
    sortDirection: SortDirection.Descending,
  })

  const selectedSort = ref('advert_date_desc')

  const currentPage = ref(1)

  const hasActiveFilters = computed(() => {
    return (
      filters.value.minYear !== undefined ||
      filters.value.maxYear !== undefined ||
      filters.value.minDate !== undefined ||
      filters.value.maxDate !== undefined
    )
  })

  const setTake = (count: 20 | 50) => {
    filters.value.take = count
    resetPagination()
  }

  const setSort = (key: string, sort: number, direction: number) => {
    selectedSort.value = key
    filters.value.sort = sort
    filters.value.sortDirection = direction
    resetPagination()
  }

  const applyFilters = (newFilters: {
    minYear?: number
    maxYear?: number
    minDate?: string
    maxDate?: string
  }) => {
    filters.value.minYear = newFilters.minYear
    filters.value.maxYear = newFilters.maxYear
    filters.value.minDate = newFilters.minDate
    filters.value.maxDate = newFilters.maxDate
    resetPagination()
  }

  const resetFilters = () => {
    filters.value.minYear = undefined
    filters.value.maxYear = undefined
    filters.value.minDate = undefined
    filters.value.maxDate = undefined
    resetPagination()
  }

  const resetPagination = () => {
    filters.value.skip = 0
    currentPage.value = 1
  }

  const nextPage = () => {
    const take = filters.value.take || 20
    currentPage.value++
    filters.value.skip = (currentPage.value - 1) * take
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      const take = filters.value.take || 20
      currentPage.value--
      filters.value.skip = (currentPage.value - 1) * take
    }
  }

  return {
    filters,
    selectedSort,
    currentPage,
    hasActiveFilters,
    setTake,
    setSort,
    applyFilters,
    resetFilters,
    resetPagination,
    nextPage,
    prevPage,
  }
})
