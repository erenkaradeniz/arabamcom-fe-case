<script setup lang="ts">
  import { SortDirection, SortType } from '@/types'
  import { ChevronDown, ChevronUp } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'

  defineProps<{
    currentSort: number
    currentDirection: number
  }>()

  const emit = defineEmits<{
    (e: 'sort', key: string, sortType: number): void
  }>()

  const { t } = useI18n()

  const headers = [
    { label: '', key: 'image', sortable: false },
    { label: t('detail.specs.model'), key: 'model', sortable: false },
    { label: t('home.title'), key: 'title', sortable: false },
    {
      label: t('detail.specs.year'),
      key: 'model_year',
      width: '80px',
      sortable: true,
      sortType: SortType.Year,
    },
    { label: t('detail.specs.km'), key: 'km', width: '120px', sortable: false },
    { label: t('detail.specs.color'), key: 'color', width: '100px', sortable: false },
    {
      label: t('home.price'),
      key: 'price',
      width: '140px',
      sortable: true,
      sortType: SortType.Price,
    },
    {
      label: t('home.date'),
      key: 'advert_date',
      width: '120px',
      sortable: true,
      sortType: SortType.Date,
    },
    { label: t('home.location'), key: 'location', width: '120px', sortable: false },
  ]

  const handleSort = (header: (typeof headers)[number]) => {
    if (!header.sortable || header.sortType === undefined) return

    emit('sort', header.key, header.sortType)
  }
</script>

<template>
  <div
    class="advert-table-grid mb-4 hidden rounded-t-xl bg-white p-4 text-sm font-semibold text-gray-500 shadow-sm md:grid dark:bg-slate-800 dark:text-gray-400">
    <div
      v-for="header in headers"
      :key="header.key"
      :class="['flex items-center gap-1', { 'hover:text-primary cursor-pointer': header.sortable }]"
      @click="handleSort(header)">
      <span>{{ header.label }}</span>

      <span v-if="header.sortable" class="flex flex-col">
        <ChevronUp
          :size="12"
          :class="{
            'text-primary':
              currentSort === header.sortType && currentDirection === SortDirection.Ascending,
            'opacity-30':
              currentSort !== header.sortType || currentDirection !== SortDirection.Ascending,
          }" />
        <ChevronDown
          :size="12"
          :class="{
            'text-primary':
              currentSort === header.sortType && currentDirection === SortDirection.Descending,
            'opacity-30':
              currentSort !== header.sortType || currentDirection !== SortDirection.Descending,
          }" />
      </span>
    </div>
  </div>
</template>
