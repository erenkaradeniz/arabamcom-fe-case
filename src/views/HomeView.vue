<script setup lang="ts">
  import AdvertCard from '@/components/advert/AdvertCard.vue'
  import AdvertControls from '@/components/advert/AdvertControls.vue'
  import AdvertFilter from '@/components/advert/AdvertFilter.vue'
  import AdvertFilterForm from '@/components/advert/AdvertFilterForm.vue'
  import AdvertListCard from '@/components/advert/AdvertListCard.vue'
  import AdvertListHeader from '@/components/advert/AdvertListHeader.vue'
  import AdvertTableCard from '@/components/advert/AdvertTableCard.vue'
  import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
  import { useAdvertListInfinite, useAdvertListPaged, useResponsiveLayout } from '@/composables'
  import { useFilterStore, useUIStore } from '@/stores'
  import { PaginationMode, SortDirection, ViewMode } from '@/types'
  import { useElementBounding } from '@vueuse/core'
  import { ChevronLeft, ChevronRight, Loader2, SearchX } from 'lucide-vue-next'
  import { storeToRefs } from 'pinia'
  import {
    computed,
    nextTick,
    onActivated,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
  } from 'vue'
  import { useI18n } from 'vue-i18n'
  import {
    onBeforeRouteLeave,
    useRouter,
    type NavigationGuardNext,
    type RouteLocationNormalized,
  } from 'vue-router'

  defineOptions({
    name: 'HomeView',
  })

  const { t } = useI18n()
  const router = useRouter()

  const uiStore = useUIStore()
  const filterStore = useFilterStore()

  const { viewMode, paginationMode, isFilterModalOpen } = storeToRefs(uiStore)
  const { filters, selectedSort, currentPage, hasActiveFilters } = storeToRefs(filterStore)

  const { activeViewMode, activePaginationMode } = useResponsiveLayout(uiStore)

  const headerRef = ref<HTMLElement | null>(null)
  const sidebarRef = ref<HTMLElement | null>(null)

  const { top: sidebarTop } = useElementBounding(sidebarRef)

  const isMerged = computed(() => sidebarTop.value <= 145)

  const sidebarFilters = reactive({
    minYear: filters.value.minYear,
    maxYear: filters.value.maxYear,
    minDate: filters.value.minDate,
    maxDate: filters.value.maxDate,
  })

  watch(
    filters,
    (newVal) => {
      sidebarFilters.minYear = newVal.minYear
      sidebarFilters.maxYear = newVal.maxYear
      sidebarFilters.minDate = newVal.minDate
      sidebarFilters.maxDate = newVal.maxDate
    },
    { deep: true }
  )

  const hasSidebarChanges = computed(() => {
    const f = filters.value
    const s = sidebarFilters

    const normalize = (val: unknown) => {
      if (val === '' || val === null || val === undefined) return undefined
      return String(val)
    }

    return (
      normalize(f.minYear) !== normalize(s.minYear) ||
      normalize(f.maxYear) !== normalize(s.maxYear) ||
      normalize(f.minDate) !== normalize(s.minDate) ||
      normalize(f.maxDate) !== normalize(s.maxDate)
    )
  })

  const handleSidebarApply = () => {
    handleApplyFilters({
      minYear: sidebarFilters.minYear ? Number(sidebarFilters.minYear) : undefined,
      maxYear: sidebarFilters.maxYear ? Number(sidebarFilters.maxYear) : undefined,
      minDate: sidebarFilters.minDate || undefined,
      maxDate: sidebarFilters.maxDate || undefined,
    })
  }

  const loadMoreTrigger = ref<HTMLElement | null>(null)

  const isInfiniteEnabled = computed(() => activePaginationMode.value === PaginationMode.Scroll)
  const isPagedEnabled = computed(() => activePaginationMode.value === PaginationMode.Pagination)

  const infiniteQuery = useAdvertListInfinite(filters, isInfiniteEnabled)
  const pagedQuery = useAdvertListPaged(filters, isPagedEnabled)

  const currentAdverts = computed(() => {
    if (activePaginationMode.value === PaginationMode.Scroll) {
      return infiniteQuery.data.value?.pages.flat() || []
    } else {
      return pagedQuery.data.value || []
    }
  })

  const isLoading = computed(() => {
    return activePaginationMode.value === PaginationMode.Scroll
      ? infiniteQuery.isLoading.value
      : pagedQuery.isLoading.value
  })

  const isError = computed(() => {
    return activePaginationMode.value === PaginationMode.Scroll
      ? infiniteQuery.isError.value
      : pagedQuery.isError.value
  })

  const error = computed(() => {
    return activePaginationMode.value === PaginationMode.Scroll
      ? infiniteQuery.error.value
      : pagedQuery.error.value
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
    if (activePaginationMode.value !== PaginationMode.Scroll) return
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
      { rootMargin: '200px' }
    )

    if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
  }

  watch(loadMoreTrigger, (el) => {
    if (el && activePaginationMode.value === PaginationMode.Scroll) setupObserver()
  })

  watch(activePaginationMode, () => {
    if (activePaginationMode.value === PaginationMode.Scroll) {
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

    if (activePaginationMode.value === PaginationMode.Scroll) {
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

  const handleApplyFilters = (newFilters: {
    minYear?: number
    maxYear?: number
    minDate?: string
    maxDate?: string
    categoryId?: number | string
  }) => {
    filterStore.applyFilters(newFilters)
    uiStore.closeFilterModal()
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
  const savedScrollPosition = ref(0)

  onBeforeRouteLeave(
    (_to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
      savedScrollPosition.value = window.scrollY
      next()
    }
  )

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
        { '!rounded-b-none !border-b-transparent !shadow-none': isMerged },
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
      <aside class="hidden w-80 flex-shrink-0 lg:block">
        <div
          ref="sidebarRef"
          :class="[
            'shadow-soft sticky top-36 rounded-2xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900',
            'transition-all duration-300',
            { '!rounded-t-none !border-t-transparent': isMerged },
          ]">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('home.filter') }}</h2>
            <button
              v-if="hasActiveFilters"
              @click="handleResetFilters"
              class="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
              {{ t('home.clear') }}
            </button>
          </div>

          <AdvertFilterForm
            v-model:min-year="sidebarFilters.minYear"
            v-model:max-year="sidebarFilters.maxYear"
            v-model:min-date="sidebarFilters.minDate"
            v-model:max-date="sidebarFilters.maxDate"
            class="mb-6" />

          <Transition
            enter-active-class="transition-all duration-300 ease-out overflow-hidden"
            enter-from-class="opacity-0 -translate-y-2 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-20"
            leave-active-class="transition-all duration-300 ease-in overflow-hidden"
            leave-from-class="opacity-100 translate-y-0 max-h-20"
            leave-to-class="opacity-0 -translate-y-2 max-h-0">
            <div v-if="hasSidebarChanges" class="pb-2">
              <button @click="handleSidebarApply" class="btn-primary w-full">
                {{ t('home.apply') }}
              </button>
            </div>
          </Transition>
        </div>
      </aside>

      <main class="w-full min-w-0 flex-1">
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
          <button @click="handleResetFilters" class="btn-secondary mt-4">
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
            @click="goToDetail(advert.id)" />
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
            @click="goToDetail(advert.id)" />
        </div>

        <div v-else-if="activeViewMode === ViewMode.Table" class="flex flex-col gap-2 pb-12">
          <AdvertListHeader
            v-if="!isLoading"
            :current-sort="filters.sort || 0"
            :current-direction="filters.sortDirection || 0"
            @sort="handleTableSort" />

          <template v-if="isLoading && !currentAdverts.length">
            <BaseSkeleton v-for="n in 10" :key="n" height="4rem" />
          </template>

          <AdvertTableCard
            v-for="(advert, index) in currentAdverts"
            :key="advert.id"
            :advert="advert"
            :index="index"
            @click="goToDetail(advert.id)" />
        </div>

        <div
          v-if="activePaginationMode === PaginationMode.Scroll"
          ref="loadMoreTrigger"
          class="flex h-20 w-full items-center justify-center py-8">
          <div
            v-if="infiniteQuery.isFetchingNextPage.value"
            class="text-primary flex items-center gap-2">
            <Loader2 :size="24" class="animate-spin" />
            <span class="text-sm font-medium">{{ t('common.loading') }}</span>
          </div>
        </div>

        <div
          v-else-if="currentAdverts.length > 0"
          class="flex items-center justify-center gap-4 border-t border-gray-100 py-8 dark:border-gray-800">
          <button
            @click="handlePageChange('prev')"
            :disabled="currentPage === 1"
            class="text-text-main flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-gray-800">
            <ChevronLeft :size="20" />
            {{ t('common.prev') }}
          </button>

          <span class="text-primary text-lg font-bold">{{ currentPage }}</span>

          <button
            @click="handlePageChange('next')"
            :disabled="currentAdverts.length < (filters.take || 20)"
            class="text-text-main flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-gray-800">
            {{ t('common.next') }}
            <ChevronRight :size="20" />
          </button>
        </div>
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
