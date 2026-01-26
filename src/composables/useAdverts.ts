import advertService from '@/services/advertService'
import type { AdvertQueryParams } from '@/types'
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/vue-query'
import { unref, type MaybeRef, type Ref } from 'vue'

export function useAdvertListInfinite(params: Ref<AdvertQueryParams>, enabled: Ref<boolean>) {
  return useInfiniteQuery({
    queryKey: ['adverts-infinite', params],
    queryFn: ({ pageParam = 0 }) => {
      const currentParams = {
        ...params.value,
        skip: pageParam,
      }
      return advertService.getAdverts(currentParams)
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < (params.value.take || 20)) {
        return undefined
      }
      const totalSkipped = allPages.length * (params.value.take || 20)
      return totalSkipped
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled,
  })
}

export function useAdvertListPaged(params: Ref<AdvertQueryParams>, enabled: Ref<boolean>) {
  return useQuery({
    queryKey: ['adverts-paged', params],
    queryFn: () => advertService.getAdverts(params.value),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
    enabled,
  })
}

export function useAdvertDetail(id: MaybeRef<number | null | undefined>) {
  return useQuery({
    queryKey: ['advert-detail', id],
    queryFn: () => advertService.getAdvertDetail(unref(id)!),
    enabled: () => !!unref(id),
    staleTime: 1000 * 60 * 30,
  })
}

export function useSimilarAdverts(
  categoryId: MaybeRef<number | null | undefined>,
  excludeId: MaybeRef<number | null | undefined>
) {
  return useQuery({
    queryKey: ['similar-adverts', categoryId],
    queryFn: async () => {
      const response = await advertService.getAdverts({
        categoryId: unref(categoryId)!,
        take: 10,
      })
      const currentId = unref(excludeId)
      return response.filter((a) => a.id !== currentId)
    },
    enabled: () => !!unref(categoryId),
    staleTime: 1000 * 60 * 5,
  })
}
