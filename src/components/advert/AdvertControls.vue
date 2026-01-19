<script setup lang="ts">
import { SortDirection, SortType } from '@/types';
import { LayoutGrid, List, Settings2, SlidersHorizontal } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  take: number
  sortKey: string
  viewMode: 'grid' | 'list'
  paginationMode: 'scroll' | 'pagination'
  hasActiveFilters: boolean
}>()

const emit = defineEmits<{
  (e: 'update:take', value: 20 | 50): void
  (e: 'update:sort', value: { key: string; sort: number; direction: number }): void
  (e: 'update:viewMode', value: 'grid' | 'list'): void
  (e: 'update:paginationMode', value: 'scroll' | 'pagination'): void
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
  { value: '20-pagination', label: '20 ' + t('common.adverts') },
  { value: '50-pagination', label: '50 ' + t('common.adverts') },
  { value: '20-scroll', label: 'Infinite Scroll' },
])

const currentPaginationConfig = computed(() => {
  return `${props.take}-${props.paginationMode}`
})

const handlePaginationChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const [takeStr, modeStr] = target.value.split('-')

  if (takeStr && modeStr) {
    emit('update:take', Number(takeStr) as 20 | 50)
    emit('update:paginationMode', modeStr as 'scroll' | 'pagination')
  }
}

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
  <div class="flex flex-wrap items-center justify-end gap-3">
    <div class="relative">
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <Settings2 :size="16" />
      </div>
      <select
        :value="currentPaginationConfig"
        @change="handlePaginationChange"
        class="select pl-9 pr-8"
      >
        <option v-for="option in paginationOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
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
            ? 'bg-gray-100 text-text-main shadow-sm dark:bg-slate-700 dark:text-white'
            : 'text-gray-400 hover:text-text-main dark:hover:text-white',
        ]"
      >
        <component :is="option.icon" :size="20" class="block" />
      </button>
    </div>
  </div>
</template>
