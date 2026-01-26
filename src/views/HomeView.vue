<script setup lang="ts">
  import AdvertControls from '@/components/advert/AdvertControls.vue'
  import AdvertPagination from '@/components/advert/AdvertPagination.vue'
  import AdvertResults from '@/components/advert/AdvertResults.vue'
  import AdvertSidebar from '@/components/advert/AdvertSidebar.vue'
  import {
    useActiveQueryState,
    useAdvertListInfinite,
    useAdvertListPaged,
    useResponsiveLayout,
    useScroll,
    useUrlFilterSync,
  } from '@/composables'
  import { useFilterStore, useUIStore } from '@/stores'
  import { PaginationMode, SortDirection } from '@/types'
  import { storeToRefs } from 'pinia'
  import { computed, defineAsyncComponent, nextTick, onActivated, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { onBeforeRouteLeave, useRouter } from 'vue-router'

  const AdvertFilter = defineAsyncComponent(() => import('@/components/advert/AdvertFilter.vue'))

  defineOptions({
    name: 'HomeView',
  })

  const { t } = useI18n()
  const router = useRouter()
  const { scrollToTop } = useScroll()

  const uiStore = useUIStore()
  const filterStore = useFilterStore()

  const { viewMode, paginationMode, isFilterModalOpen } = storeToRefs(uiStore)
  const { filters, selectedSort, currentPage, hasActiveFilters } = storeToRefs(filterStore)

  const { activeViewMode, activePaginationMode } = useResponsiveLayout(uiStore)

  const headerRef = ref<HTMLElement | null>(null)
  const isMerged = ref(false)

  const handleApplyFilters = (newFilters: {
    minYear?: number
    maxYear?: number
    minDate?: string
    maxDate?: string
    categoryId?: number | string
  }) => {
    filterStore.applyFilters({
      minYear: newFilters.minYear ? Number(newFilters.minYear) : undefined,
      maxYear: newFilters.maxYear ? Number(newFilters.maxYear) : undefined,
      minDate: newFilters.minDate || undefined,
      maxDate: newFilters.maxDate || undefined,
      categoryId: newFilters.categoryId,
    })
    uiStore.closeFilterModal()
    scrollToTop()
  }

  const handleSidebarApply = (newFilters: {
    minYear?: number
    maxYear?: number
    minDate?: string
    maxDate?: string
  }) => {
    handleApplyFilters({
      minYear: newFilters.minYear,
      maxYear: newFilters.maxYear,
      minDate: newFilters.minDate,
      maxDate: newFilters.maxDate,
    })
  }

  const isInfiniteEnabled = computed(() => activePaginationMode.value === PaginationMode.Scroll)
  const isPagedEnabled = computed(() => activePaginationMode.value === PaginationMode.Pagination)

  const infiniteQuery = useAdvertListInfinite(filters, isInfiniteEnabled)
  const pagedQuery = useAdvertListPaged(filters, isPagedEnabled)

  const { currentAdverts, isLoading, isError, error } = useActiveQueryState(
    infiniteQuery,
    pagedQuery,
    activePaginationMode
  )

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      filterStore.nextPage()
    } else {
      filterStore.prevPage()
    }
    scrollToTop(true)
  }

  const goToDetail = (id: number) => {
    router.push({ name: 'advert-detail', params: { id } })
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

  const handleTableSort = (key: string, sortType: number) => {
    if (filters.value.sort === sortType) {
      const currentDirection = filters.value.sortDirection
      const newDirection =
        currentDirection === SortDirection.Descending
          ? SortDirection.Ascending
          : SortDirection.Descending

      const dirSuffix = newDirection === SortDirection.Ascending ? 'asc' : 'desc'
      filterStore.setSort(`${key}_${dirSuffix}`, sortType, newDirection)
    } else {
      const direction = SortDirection.Descending
      const dirSuffix = 'desc'

      const sortKey = `${key}_${dirSuffix}`

      filterStore.setSort(sortKey, sortType, direction)
    }

    scrollToTop()
  }

  const handleResetFilters = () => {
    filterStore.resetFilters()
    scrollToTop()
  }

  const handlePaginationModeChange = (mode: PaginationMode) => {
    uiStore.setPaginationMode(mode)
    scrollToTop()
  }

  useUrlFilterSync(filters.value)

  const savedScrollPosition = ref(0)

  onBeforeRouteLeave(() => {
    savedScrollPosition.value = window.scrollY
  })

  onActivated(() => {
    if (savedScrollPosition.value > 0) {
      nextTick(() => {
        window.scrollTo({
          top: savedScrollPosition.value,
          behavior: 'instant',
        })
      })
    }
  })
</script>

<template>
  <div>
    <div
      ref="headerRef"
      :class="[
        'shadow-soft sticky top-20 z-40 mb-6 flex w-full flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 bg-white/80 p-2 backdrop-blur-md sm:mb-8 sm:gap-4 sm:rounded-2xl sm:p-3 dark:border-slate-800 dark:bg-slate-900/80',
        'transition-all duration-300',
        { 'rounded-b-none! border-b-transparent! shadow-none!': isMerged },
      ]">
      <div
        class="hidden h-10 items-center px-1 text-sm font-bold text-gray-800 sm:flex sm:px-2 sm:text-base dark:text-gray-200">
        <span v-if="isLoading && !currentAdverts.length">{{ t('home.loading_listings') }}</span>
        <span v-else>{{ t('home.listing_count', { count: currentAdverts.length }) }}</span>
      </div>

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
        @open-filter="uiStore.openFilterModal" />
    </div>

    <div v-if="isError" class="rounded-xl border border-red-200 bg-red-50 p-4 text-red-600">
      {{ error?.message || t('common.error') }}
    </div>

    <div class="flex w-full flex-col lg:flex-row lg:gap-8">
      <AdvertSidebar @apply="handleSidebarApply" @reset="handleResetFilters" />

      <main class="w-full min-w-0 flex-1">
        <AdvertResults
          :current-adverts="currentAdverts"
          :is-loading="isLoading"
          :active-view-mode="activeViewMode"
          :sort="filters.sort || 0"
          :sort-direction="filters.sortDirection || 0"
          @detail="goToDetail"
          @sort="handleTableSort"
          @reset="handleResetFilters" />

        <AdvertPagination
          :mode="activePaginationMode"
          :is-fetching-next-page="infiniteQuery.isFetchingNextPage.value"
          :has-more="infiniteQuery.hasNextPage.value ?? false"
          :current-page="currentPage"
          :total-count="currentAdverts.length"
          :take="filters.take || 20"
          @next-page="handlePageChange('next')"
          @prev-page="handlePageChange('prev')"
          @load-more="infiniteQuery.fetchNextPage()" />
      </main>
    </div>

    <AdvertFilter
      :is-open="isFilterModalOpen"
      :initial-min-year="filters.minYear"
      :initial-max-year="filters.maxYear"
      :initial-min-date="filters.minDate"
      :initial-max-date="filters.maxDate"
      @close="uiStore.closeFilterModal"
      @apply="handleApplyFilters"
      @reset="handleResetFilters" />
  </div>
</template>
