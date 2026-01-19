<script setup lang="ts">
import AdvertCard from '@/components/advert/AdvertCard.vue'
import AdvertControls from '@/components/advert/AdvertControls.vue'
import AdvertFilter from '@/components/advert/AdvertFilter.vue'
import AdvertHeader from '@/components/advert/AdvertHeader.vue'
import AdvertListCard from '@/components/advert/AdvertListCard.vue'
import { useAdvertListInfinite, useAdvertListPaged } from '@/composables/useAdverts'
import { useFilterStore, useUIStore } from '@/stores'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

const uiStore = useUIStore()
const filterStore = useFilterStore()

const { viewMode, paginationMode, isFilterModalOpen } = storeToRefs(uiStore)
const { filters, selectedSort, currentPage, hasActiveFilters } = storeToRefs(filterStore)

const loadMoreTrigger = ref<HTMLElement | null>(null)

const isInfiniteEnabled = computed(() => paginationMode.value === 'scroll')
const isPagedEnabled = computed(() => paginationMode.value === 'pagination')

const infiniteQuery = useAdvertListInfinite(filters, isInfiniteEnabled)
const pagedQuery = useAdvertListPaged(filters, isPagedEnabled)

const currentAdverts = computed(() => {
  if (paginationMode.value === 'scroll') {
    return infiniteQuery.data.value?.pages.flat() || []
  } else {
    return pagedQuery.data.value || []
  }
})

const isLoading = computed(() => {
  return paginationMode.value === 'scroll'
    ? infiniteQuery.isLoading.value
    : pagedQuery.isLoading.value
})

const isError = computed(() => {
  return paginationMode.value === 'scroll' ? infiniteQuery.isError.value : pagedQuery.isError.value
})

const error = computed(() => {
  return paginationMode.value === 'scroll' ? infiniteQuery.error.value : pagedQuery.error.value
})

const handlePageChange = (direction: 'next' | 'prev') => {
  if (direction === 'next') {
    filterStore.nextPage()
  } else {
    filterStore.prevPage()
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

let observer: IntersectionObserver | null = null

const setupObserver = () => {
  if (paginationMode.value !== 'scroll') return
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0]?.isIntersecting &&
        !infiniteQuery.isFetchingNextPage.value &&
        infiniteQuery.hasNextPage.value
      ) {
        infiniteQuery.fetchNextPage()
      }
    },
    { rootMargin: '200px' },
  )

  if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
}

watch(loadMoreTrigger, (el) => {
  if (el && paginationMode.value === 'scroll') setupObserver()
})

watch(paginationMode, () => {
  if (paginationMode.value === 'scroll') {
    setTimeout(setupObserver, 100)
  } else {
    if (observer) observer.disconnect()
  }
})

onMounted(() => {
  setupObserver()
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})

const goToDetail = (id: number) => {
  router.push({ name: 'advert-detail', params: { id } })
}

const scrollToTop = () => {
  if (observer) observer.disconnect()
  window.scrollTo({ top: 0, behavior: 'auto' })

  if (paginationMode.value === 'scroll') {
    setTimeout(() => {
      setupObserver()
    }, 100)
  }
}

const handleTakeChange = (count: 20 | 50) => {
  filterStore.setTake(count)
  scrollToTop()
}

const handleSortChange = ({
  key,
  sort,
  direction,
}: {
  key: string
  sort: number
  direction: number
}) => {
  filterStore.setSort(key, sort, direction)
  scrollToTop()
}

const handleApplyFilters = (newFilters: {
  minYear?: number
  maxYear?: number
  minDate?: string
  maxDate?: string
}) => {
  filterStore.applyFilters(newFilters)
  uiStore.closeFilterModal()
  scrollToTop()
}

const handleResetFilters = () => {
  filterStore.resetFilters()
  scrollToTop()
}

const handlePaginationModeChange = (mode: 'scroll' | 'pagination') => {
  uiStore.setPaginationMode(mode)
  scrollToTop()
}
</script>

<template>
  <div>
    <AdvertHeader
      class="mb-6"
      :is-loading="isLoading"
      :listing-count="currentAdverts.length"
    />

    <div class="sticky top-20 z-40 mb-8 rounded-2xl bg-white/80 p-3 shadow-soft backdrop-blur-md transition-all dark:bg-slate-900/80 border border-gray-100 dark:border-slate-800">
      <AdvertControls
        :take="filters.take || 20"
        :sort-key="selectedSort"
        :view-mode="viewMode"
        :pagination-mode="paginationMode"
        :has-active-filters="hasActiveFilters"
        @update:take="handleTakeChange"
        @update:sort="handleSortChange"
        @update:view-mode="(mode) => (viewMode = mode)"
        @update:pagination-mode="handlePaginationModeChange"
        @open-filter="uiStore.openFilterModal"
      />
    </div>

    <div v-if="isError" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
      {{ error?.message || t('common.error') }}
    </div>

    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12"
    >
      <template v-if="isLoading && !currentAdverts.length">
        <div
          v-for="n in 8"
          :key="n"
          class="bg-gray-200 dark:bg-gray-800 rounded-xl h-[350px] animate-pulse"
        ></div>
      </template>

      <AdvertCard
        v-for="(advert, index) in currentAdverts"
        :key="advert.id"
        :advert="advert"
        :index="index"
        @click="goToDetail(advert.id)"
      />
    </div>

    <div v-else class="flex flex-col gap-4 pb-12">
      <template v-if="isLoading && !currentAdverts.length">
        <div
          v-for="n in 5"
          :key="n"
          class="bg-gray-200 dark:bg-gray-800 rounded-xl h-[180px] animate-pulse"
        ></div>
      </template>

      <AdvertListCard
        v-for="(advert, index) in currentAdverts"
        :key="advert.id"
        :advert="advert"
        :index="index"
        @click="goToDetail(advert.id)"
      />
    </div>

    <div
      v-if="paginationMode === 'scroll'"
      ref="loadMoreTrigger"
      class="py-8 flex justify-center items-center w-full h-20"
    >
      <div
        v-if="infiniteQuery.isFetchingNextPage.value"
        class="flex items-center gap-2 text-primary"
      >
        <Loader2 :size="24" class="animate-spin" />
        <span class="font-medium text-sm">{{ t('common.loading') }}</span>
      </div>
    </div>

    <div
      v-else-if="currentAdverts.length > 0"
      class="flex justify-center items-center gap-4 py-8 border-t border-gray-100 dark:border-gray-800"
    >
      <button
        @click="handlePageChange('prev')"
        :disabled="currentPage === 1"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white"
      >
        <ChevronLeft :size="20" />
        {{ t('common.prev') }}
      </button>

      <span class="font-bold text-lg text-primary">{{ currentPage }}</span>

      <button
        @click="handlePageChange('next')"
        :disabled="currentAdverts.length < (filters.take || 20)"
        class="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white"
      >
        {{ t('common.next') }}
        <ChevronRight :size="20" />
      </button>
    </div>

    <AdvertFilter
      :is-open="isFilterModalOpen"
      :initial-min-year="filters.minYear"
      :initial-max-year="filters.maxYear"
      :initial-min-date="filters.minDate"
      :initial-max-date="filters.maxDate"
      @close="uiStore.closeFilterModal"
      @apply="handleApplyFilters"
      @reset="handleResetFilters"
    />
  </div>
</template>
