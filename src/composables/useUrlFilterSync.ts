import type { AdvertQueryParams } from '@/types'
import { useUrlSearchParams } from '@vueuse/core'
import { nextTick, onActivated, onDeactivated, watch, type WatchStopHandle } from 'vue'

const parseNumber = (val: unknown): number | undefined => {
  if (val === undefined || val === null || val === '') return undefined
  const num = Number(val)
  return isNaN(num) ? undefined : num
}

const parseString = (val: unknown): string | undefined => {
  if (val === undefined || val === null || val === '') return undefined
  return String(val)
}

export function useUrlFilterSync(filters: AdvertQueryParams) {
  const params = useUrlSearchParams('history', { removeNullishValues: true })
  let stopWatchers: WatchStopHandle[] = []

  const updateFiltersFromUrl = () => {
    if (params.take) filters.take = parseNumber(params.take)
    if (params.skip) filters.skip = parseNumber(params.skip)

    if (params.sort !== undefined) filters.sort = parseNumber(params.sort)
    if (params.sortDirection !== undefined)
      filters.sortDirection = parseNumber(params.sortDirection)

    filters.minYear = parseNumber(params.minYear)
    filters.maxYear = parseNumber(params.maxYear)
    filters.categoryId = parseNumber(params.categoryId)
    filters.minDate = parseString(params.minDate)
    filters.maxDate = parseString(params.maxDate)
  }

  const startSync = () => {
    const hasUrlParams = Object.keys(params).length > 0

    if (hasUrlParams) {
      updateFiltersFromUrl()
    } else {
      Object.assign(params, filters)
    }

    const unwatchFilters = watch(
      filters,
      (newVal) => {
        Object.assign(params, newVal)
      },
      { deep: true }
    )

    const unwatchParams = watch(params, () => {
      updateFiltersFromUrl()
    })

    stopWatchers.push(unwatchFilters, unwatchParams)
  }

  const stopSync = () => {
    stopWatchers.forEach((fn) => fn())
    stopWatchers = []
  }

  onActivated(() => {
    nextTick(() => {
      startSync()
    })
  })

  onDeactivated(() => {
    stopSync()
  })
}
