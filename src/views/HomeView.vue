<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAdvertListInfinite, useAdvertListPaged } from '@/composables/useAdverts'
import AdvertCard from '@/components/advert/AdvertCard.vue'
import AdvertListCard from '@/components/advert/AdvertListCard.vue'
import AdvertFilter from '@/components/advert/AdvertFilter.vue'
import AdvertHeader from '@/components/advert/AdvertHeader.vue'
import AdvertControls from '@/components/advert/AdvertControls.vue'
import { type AdvertQueryParams, SortType, SortDirection } from '@/types'
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const viewMode = ref<'grid' | 'list'>('grid')
const paginationMode = ref<'scroll' | 'pagination'>('scroll')
const currentPage = ref(1)

const filters = ref<AdvertQueryParams>({
  take: 20,
  skip: 0,
  sort: SortType.Date,
  sortDirection: SortDirection.Descending,
})

const selectedSort = ref('advert_date_desc')
const isFilterModalOpen = ref(false)
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
  const take = filters.value.take || 20
  if (direction === 'next') {
    currentPage.value++
    filters.value.skip = (currentPage.value - 1) * take
  } else if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--
    filters.value.skip = (currentPage.value - 1) * take
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const togglePaginationMode = () => {
  paginationMode.value = paginationMode.value === 'scroll' ? 'pagination' : 'scroll'
  filters.value.skip = 0
  currentPage.value = 1
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

const handleTakeChange = (count: 20 | 50) => {
  filters.value.take = count
  filters.value.skip = 0
  currentPage.value = 1
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
  selectedSort.value = key
  filters.value.sort = sort
  filters.value.sortDirection = direction
  filters.value.skip = 0
  currentPage.value = 1
}

const handleApplyFilters = (newFilters: {
  minYear?: number
  maxYear?: number
  minDate?: string
  maxDate?: string
}) => {
  filters.value.minYear = newFilters.minYear
  filters.value.maxYear = newFilters.maxYear
  filters.value.minDate = newFilters.minDate
  filters.value.maxDate = newFilters.maxDate
  filters.value.skip = 0
  currentPage.value = 1
  isFilterModalOpen.value = false
}

const handleResetFilters = () => {
  filters.value.minYear = undefined
  filters.value.maxYear = undefined
  filters.value.minDate = undefined
  filters.value.maxDate = undefined
  filters.value.skip = 0
  currentPage.value = 1
}

const hasActiveFilters = computed(() => {
  return (
    filters.value.minYear !== undefined ||
    filters.value.maxYear !== undefined ||
    filters.value.minDate !== undefined ||
    filters.value.maxDate !== undefined
  )
})
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
      <AdvertHeader
        :is-loading="isLoading"
        :listing-count="currentAdverts.length"
        :pagination-mode="paginationMode"
        @toggle-mode="togglePaginationMode"
      />

      <AdvertControls
        :take="filters.take || 20"
        :sort-key="selectedSort"
        :view-mode="viewMode"
        :has-active-filters="hasActiveFilters"
        @update:take="handleTakeChange"
        @update:sort="handleSortChange"
        @update:view-mode="(mode) => (viewMode = mode)"
        @open-filter="isFilterModalOpen = true"
      />
    </div>

    <div v-if="isError" class="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
      {{ error?.message || t('common.error') }}
    </div>

    <div
      v-if="paginationMode === 'pagination' && currentAdverts.length > 0"
      class="flex justify-end items-center gap-4 mb-4"
    >
      <div class="flex items-center gap-2">
        <button
          @click="handlePageChange('prev')"
          :disabled="currentPage === 1"
          class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white"
          :title="t('common.prev')"
        >
          <ChevronLeft :size="20" />
        </button>

        <span class="font-bold text-sm text-primary min-w-[3ch] text-center">{{
          currentPage
        }}</span>

        <button
          @click="handlePageChange('next')"
          :disabled="currentAdverts.length < (filters.take || 20)"
          class="p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-text-main dark:text-white"
          :title="t('common.next')"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
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
      @close="isFilterModalOpen = false"
      @apply="handleApplyFilters"
      @reset="handleResetFilters"
    />
  </div>
</template>
