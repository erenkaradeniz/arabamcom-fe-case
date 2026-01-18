<script setup lang="ts">
import { computed } from 'vue'
import { SlidersHorizontal, LayoutGrid, List } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { SortType, SortDirection } from '@/types'

defineProps<{
  take: number
  sortKey: string
  viewMode: 'grid' | 'list'
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'update:take', value: 20 | 50): void
  (e: 'update:sort', value: { key: string; sort: number; direction: number }): void
  (e: 'update:viewMode', value: 'grid' | 'list'): void
  (e: 'openFilter'): void
}>()

const { t } = useI18n()

const sortOptions = computed(() => [
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
])

const viewOptions = [
  { value: 'grid', icon: LayoutGrid },
  { value: 'list', icon: List },
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
  <div class="flex flex-wrap items-center gap-3">
    <div
      class="flex items-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <button
        v-for="value in [20, 50] as const"
        :key="value"
        @click="$emit('update:take', value)"
        :class="[
          'px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
          take === value
            ? 'bg-primary text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
        ]"
      >
        {{ value }}
      </button>
    </div>

    <select
      :value="sortKey"
      @change="handleSort"
      class="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
    >
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <button
      @click="$emit('openFilter')"
      class="relative flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-red-700 transition cursor-pointer"
    >
      <SlidersHorizontal :size="18" />
      {{ t('home.filter') }}
      <span
        v-if="hasActiveFilters"
        class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
      ></span>
    </button>

    <div
      class="flex bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <button
        v-for="option in viewOptions"
        :key="option.value"
        @click="$emit('update:viewMode', option.value)"
        :class="[
          'p-1.5 rounded-md transition-colors cursor-pointer',
          viewMode === option.value
            ? 'bg-gray-100 dark:bg-gray-700 text-text-main dark:text-white shadow-sm'
            : 'text-gray-400 hover:text-text-main dark:hover:text-white',
        ]"
      >
        <component :is="option.icon" :size="20" class="block" />
      </button>
    </div>
  </div>
</template>
