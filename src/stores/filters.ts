import { type AdvertQueryParams, SortDirection, SortType } from '@/types'
import { useUrlSearchParams } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFilterStore = defineStore('filters', () => {
  const filters = useUrlSearchParams<AdvertQueryParams>('history', {
    removeFalsyValues: true,
  })

  if (!filters.take) filters.take = 20
  if (filters.skip === undefined) filters.skip = 0
  if (!filters.sort) filters.sort = SortType.Date
  if (!filters.sortDirection) filters.sortDirection = SortDirection.Descending

  const selectedSort = ref('advert_date_desc')

  const currentPage = computed({
    get: () => {
      const skip = Number(filters.skip) || 0
      const take = Number(filters.take) || 20
      return Math.floor(skip / take) + 1
    },
    set: (val) => {
      const take = Number(filters.take) || 20
      filters.skip = (val - 1) * take
    },
  })

  const hasActiveFilters = computed(() => {
    return (
      filters.minYear !== undefined ||
      filters.maxYear !== undefined ||
      filters.minDate !== undefined ||
      filters.maxDate !== undefined ||
      filters.categoryId !== undefined
    )
  })

  const setTake = (count: 20 | 50) => {
    filters.take = count
    resetPagination()
  }

  const setSort = (key: string, sort?: number, direction?: number) => {
    selectedSort.value = key
    filters.sort = sort
    filters.sortDirection = direction
    resetPagination()
  }

  const applyFilters = (newFilters: {
    minYear?: number
    maxYear?: number
    minDate?: string
    maxDate?: string
    categoryId?: number | string
  }) => {
    filters.minYear = newFilters.minYear
    filters.maxYear = newFilters.maxYear
    filters.minDate = newFilters.minDate
    filters.maxDate = newFilters.maxDate
    filters.categoryId = newFilters.categoryId ? Number(newFilters.categoryId) : undefined
    resetPagination()
  }

  const resetFilters = () => {
    filters.minYear = undefined
    filters.maxYear = undefined
    filters.minDate = undefined
    filters.maxDate = undefined
    filters.categoryId = undefined
    resetPagination()
  }

  const resetPagination = () => {
    filters.skip = 0
  }

  const nextPage = () => {
    const current = currentPage.value
    currentPage.value = current + 1
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value = currentPage.value - 1
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
