import type { AdvertListItem } from '@/types'
import { formatKm } from '@/utils/format'
import { Calendar, Gauge, Palette } from 'lucide-vue-next'
import { computed } from 'vue'

export const useAdvertDisplay = (advert: AdvertListItem) => {
  const getProperty = (name: string) => {
    return advert.properties?.find((p) => p.name === name)?.value
  }

  const advertProperties = computed(() => {
    const items = []
    const year = getProperty('year')
    if (year) items.push({ label: 'year', value: year, icon: Calendar })

    const km = getProperty('km')
    if (km) items.push({ label: 'km', value: formatKm(km), icon: Gauge })

    const color = getProperty('color')
    if (color) items.push({ label: 'color', value: color, icon: Palette })

    return items
  })

  return {
    getProperty,
    advertProperties,
  }
}
