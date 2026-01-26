import { PaginationMode, type AdvertListItem } from '@/types'
import { computed, type ComputedRef, type Ref } from 'vue'

interface InfiniteQueryLike {
  data: Ref<{ pages: AdvertListItem[][] } | undefined>
  isLoading: Ref<boolean>
  isError: Ref<boolean>
  error: Ref<Error | null>
}

interface PagedQueryLike {
  data: Ref<AdvertListItem[] | undefined>
  isLoading: Ref<boolean>
  isError: Ref<boolean>
  error: Ref<Error | null>
}

export function useActiveQueryState(
  infiniteQuery: InfiniteQueryLike,
  pagedQuery: PagedQueryLike,
  activePaginationMode: ComputedRef<PaginationMode>
) {
  const isScrollMode = computed(() => activePaginationMode.value === PaginationMode.Scroll)

  const currentAdverts = computed<AdvertListItem[]>(() => {
    if (isScrollMode.value) {
      return infiniteQuery.data.value?.pages.flat() || []
    }
    return pagedQuery.data.value || []
  })

  const isLoading = computed(() =>
    isScrollMode.value ? infiniteQuery.isLoading.value : pagedQuery.isLoading.value
  )

  const isError = computed(() =>
    isScrollMode.value ? infiniteQuery.isError.value : pagedQuery.isError.value
  )

  const error = computed(() =>
    isScrollMode.value ? infiniteQuery.error.value : pagedQuery.error.value
  )

  return {
    currentAdverts,
    isLoading,
    isError,
    error,
    isScrollMode,
  }
}
