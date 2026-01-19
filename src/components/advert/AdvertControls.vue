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
    <div class="toggle-group">
      <button
        v-for="value in [20, 50] as const"
        :key="value"
        @click="$emit('update:take', value)"
        :class="take === value ? 'toggle-btn-active' : 'toggle-btn-inactive'"
      >
        {{ value }}
      </button>
    </div>

    <select :value="sortKey" @change="handleSort" class="select">
      <option v-for="option in sortOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>

    <button @click="$emit('openFilter')" class="btn-primary relative">
      <SlidersHorizontal :size="18" />
      {{ t('home.filter') }}
      <span
        v-if="hasActiveFilters"
        class="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500"
      ></span>
    </button>

    <div class="toggle-group p-1">
      <button
        v-for="option in viewOptions"
        :key="option.value"
        @click="$emit('update:viewMode', option.value)"
        :class="[
          'cursor-pointer rounded-md p-1.5 transition-colors',
          viewMode === option.value
            ? 'bg-gray-100 text-text-main shadow-sm dark:bg-gray-700 dark:text-white'
            : 'text-gray-400 hover:text-text-main dark:hover:text-white',
        ]"
      >
        <component :is="option.icon" :size="20" class="block" />
      </button>
    </div>
  </div>
</template>
