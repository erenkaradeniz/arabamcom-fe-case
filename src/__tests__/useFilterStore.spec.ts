import { useFilterStore } from '@/stores/filters'
import { SortDirection, SortType } from '@/types'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

describe('useFilterStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates take count', () => {
    const store = useFilterStore()
    expect(store.filters.take).toBe(20)
    store.setTake(50)
    expect(store.filters.take).toBe(50)
  })

  it('updates sort settings', () => {
    const store = useFilterStore()
    store.setSort('price_asc', SortType.Price, SortDirection.Ascending)

    expect(store.selectedSort).toBe('price_asc')
    expect(store.filters.sort).toBe(SortType.Price)
    expect(store.filters.sortDirection).toBe(SortDirection.Ascending)
  })

  it('applies filters correctly', () => {
    const store = useFilterStore()
    store.applyFilters({ minYear: 2020, maxYear: 2023 })

    expect(store.filters.minYear).toBe(2020)
    expect(store.filters.maxYear).toBe(2023)
  })

  it('resets filters to default', () => {
    const store = useFilterStore()
    store.applyFilters({ minYear: 2020 })
    store.setTake(50)

    store.resetFilters()

    expect(store.filters.minYear).toBeUndefined()
    expect(store.filters.take).toBe(50)
  })
})
