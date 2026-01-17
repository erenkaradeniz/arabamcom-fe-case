import { useQuery, keepPreviousData } from '@tanstack/vue-query'
import { unref, type Ref, type MaybeRef } from 'vue'
import advertService from '@/services/advertService'
import type { AdvertQueryParams } from '@/types'

export function useAdvertList(params: Ref<AdvertQueryParams>) {
  return useQuery({
    queryKey: ['adverts', params],
    queryFn: () => advertService.getAdverts(params.value),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
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
