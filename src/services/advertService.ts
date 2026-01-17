import apiClient from './apiClient'
import type { AdvertQueryParams, AdvertListItem, AdvertDetail } from '@/types'

export default {
  getAdverts(params: AdvertQueryParams): Promise<AdvertListItem[]> {
    return apiClient.get('/listing', { params })
  },

  getAdvertDetail(id: number): Promise<AdvertDetail> {
    return apiClient.get('/detail', {
      params: { id },
    })
  },
}
