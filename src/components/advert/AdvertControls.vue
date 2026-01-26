<script setup lang="ts">
  import { PaginationMode, SortDirection, SortType, ViewMode } from '@/types'
  import { LayoutGrid, List, Settings2, SlidersHorizontal, TableProperties } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    take: number
    sortKey: string
    viewMode: ViewMode
    paginationMode: PaginationMode
    hasActiveFilters: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:take', value: 20 | 50): void
    (e: 'update:sort', value: { key: string; sort: number; direction: number }): void
    (e: 'update:viewMode', value: ViewMode): void
    (e: 'update:paginationMode', value: PaginationMode): void
    (e: 'openFilter'): void
  }>()

  const { t } = useI18n()

  const sortOptions = computed(() => [
    {
      value: 'price_asc',
      label: t('sort.price_asc'),
      sort: SortType.Price,
      direction: SortDirection.Ascending,
    },
    {
      value: 'price_desc',
      label: t('sort.price_desc'),
      sort: SortType.Price,
      direction: SortDirection.Descending,
    },
    {
      value: 'model_year_desc',
      label: t('sort.model_year_desc'),
      sort: SortType.Year,
      direction: SortDirection.Descending,
    },
    {
      value: 'model_year_asc',
      label: t('sort.model_year_asc'),
      sort: SortType.Year,
      direction: SortDirection.Ascending,
    },
    {
      value: 'advert_date_desc',
      label: t('sort.advert_date_desc'),
      sort: SortType.Date,
      direction: SortDirection.Descending,
    },
    {
      value: 'advert_date_asc',
      label: t('sort.advert_date_asc'),
      sort: SortType.Date,
      direction: SortDirection.Ascending,
    },
  ])

  const paginationOptions = computed(() => [
    { value: '20-' + PaginationMode.Pagination, label: '20 ' + t('common.adverts') },
    { value: '50-' + PaginationMode.Pagination, label: '50 ' + t('common.adverts') },
    { value: '20-' + PaginationMode.Scroll, label: 'Infinite Scroll' },
  ])

  const currentPaginationConfig = computed(() => {
    return `${props.take}-${props.paginationMode}`
  })

  const handlePaginationChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const [takeStr, modeStr] = target.value.split('-')

    if (takeStr && modeStr) {
      emit('update:take', Number(takeStr) as 20 | 50)
      emit('update:paginationMode', modeStr as PaginationMode)
    }
  }

  const viewOptions = [
    { value: ViewMode.Grid, icon: LayoutGrid },
    { value: ViewMode.List, icon: List },
    { value: ViewMode.Table, icon: TableProperties },
  ] as const

  const handleSort = (event: Event) => {
    const target = event.target as HTMLSelectElement
    const option = sortOptions.value.find((o) => o.value === target.value)
    if (option) {
      emit('update:sort', { key: option.value, sort: option.sort, direction: option.direction })
    }
  }
</script>

<template>
  <div class="flex w-full flex-1 items-center gap-2 sm:w-auto sm:flex-none lg:gap-3">
    <select
      id="sort-select"
      name="sort-select"
      :value="sortKey"
      @change="handleSort"
      aria-label="Sort adverts"
      class="select min-w-0 flex-1 text-xs sm:flex-none sm:text-sm">
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <div class="relative hidden min-[1600px]:block">
      <div class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
        <Settings2 :size="16" />
      </div>
      <select
        id="pagination-select"
        name="pagination-select"
        :value="currentPaginationConfig"
        @change="handlePaginationChange"
        aria-label="Pagination options"
        class="select pr-8 pl-9">
        <option v-for="option in paginationOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <div class="toggle-group hidden p-0.5 min-[1600px]:flex sm:p-1">
        <button
          v-for="option in viewOptions"
          :key="option.value"
          @click="$emit('update:viewMode', option.value)"
          :aria-label="`Switch to ${option.value} view`"
          :aria-pressed="viewMode === option.value"
          :class="[
            'rounded-md p-1.5 transition-colors sm:p-2',
            viewMode === option.value
              ? 'text-text-main bg-gray-100 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'hover:text-text-main text-gray-400 dark:hover:text-white',
            option.value === ViewMode.Table ? 'hidden md:flex' : '',
          ]">
          <component :is="option.icon" :size="20" />
        </button>
      </div>

      <button
        @click="$emit('openFilter')"
        aria-label="Open filters"
        class="btn-primary relative flex h-9 w-9 items-center justify-center p-0 lg:hidden">
        <SlidersHorizontal :size="18" />
        <span
          v-if="hasActiveFilters"
          class="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500"></span>
      </button>
    </div>
  </div>
</template>
