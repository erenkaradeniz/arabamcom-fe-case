<script setup lang="ts">
  import AdvertCard from '@/components/advert/AdvertCard.vue'
  import AdvertListCard from '@/components/advert/AdvertListCard.vue'
  import AdvertListHeader from '@/components/advert/AdvertListHeader.vue'
  import AdvertTableCard from '@/components/advert/AdvertTableCard.vue'
  import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
  import type { AdvertListItem } from '@/types'
  import { ViewMode } from '@/types'
  import { SearchX } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'

  defineProps<{
    currentAdverts: AdvertListItem[]
    isLoading: boolean
    activeViewMode: ViewMode
    sort: number
    sortDirection: number
  }>()

  const emit = defineEmits<{
    (e: 'detail', id: number): void
    (e: 'sort', key: string, sortType: number): void
    (e: 'reset'): void
  }>()

  const { t } = useI18n()
</script>

<template>
  <div class="w-full">
    <div
      v-if="!isLoading && currentAdverts.length === 0"
      class="flex w-full flex-1 flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 py-24 text-center dark:border-slate-800 dark:bg-slate-900/50"
      style="min-height: 600px">
      <div class="rounded-full bg-white p-6 shadow-sm dark:bg-slate-800">
        <SearchX class="text-gray-400 dark:text-gray-500" :size="48" />
      </div>
      <div class="space-y-1">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ t('home.no_results_found') }}
        </h3>
        <p class="text-text-muted text-sm">
          {{ t('home.try_changing_filters') }}
        </p>
      </div>
      <button @click="emit('reset')" class="btn-secondary mt-4">
        {{ t('home.clear_filters') }}
      </button>
    </div>

    <div
      v-else-if="activeViewMode === ViewMode.Grid"
      class="grid grid-cols-1 gap-6 pb-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      <template v-if="isLoading && !currentAdverts.length">
        <BaseSkeleton v-for="n in 8" :key="n" height="22rem" />
      </template>

      <AdvertCard
        v-for="(advert, index) in currentAdverts"
        :key="advert.id"
        :advert="advert"
        :index="index"
        @click="emit('detail', advert.id)" />
    </div>

    <div v-else-if="activeViewMode === ViewMode.List" class="flex flex-col gap-4 pb-12">
      <template v-if="isLoading && !currentAdverts.length">
        <BaseSkeleton v-for="n in 5" :key="n" height="12.5rem" />
      </template>

      <AdvertListCard
        v-for="(advert, index) in currentAdverts"
        :key="advert.id"
        :advert="advert"
        :index="index"
        @click="emit('detail', advert.id)" />
    </div>

    <div v-else-if="activeViewMode === ViewMode.Table" class="flex flex-col gap-2 pb-12">
      <AdvertListHeader
        v-if="!isLoading"
        :current-sort="sort"
        :current-direction="sortDirection"
        @sort="(k, t) => emit('sort', k, t)" />

      <template v-if="isLoading && !currentAdverts.length">
        <BaseSkeleton v-for="n in 10" :key="n" height="4rem" />
      </template>

      <AdvertTableCard
        v-for="(advert, index) in currentAdverts"
        :key="advert.id"
        :advert="advert"
        :index="index"
        @click="emit('detail', advert.id)" />
    </div>
  </div>
</template>
