import { type AdvertQueryParams, SortDirection, SortType } from '@/types'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFilterStore = defineStore('filters', () => {
  const filters = useStorage<AdvertQueryParams>('advert-filters', {
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
      filters.value.maxDate !== undefined ||
      filters.value.categoryId !== undefined
    )
  })

  const setTake = (count: 20 | 50) => {
    filters.value.take = count
    resetPagination()
  }

  const setSort = (key: string, sort?: number, direction?: number) => {
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
    categoryId?: number | string
  }) => {
    filters.value.minYear = newFilters.minYear
    filters.value.maxYear = newFilters.maxYear
    filters.value.minDate = newFilters.minDate
    filters.value.maxDate = newFilters.maxDate
    filters.value.categoryId = newFilters.categoryId ? Number(newFilters.categoryId) : undefined
    resetPagination()
  }

  const resetFilters = () => {
    filters.value.minYear = undefined
    filters.value.maxYear = undefined
    filters.value.minDate = undefined
    filters.value.maxDate = undefined
    filters.value.categoryId = undefined
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
