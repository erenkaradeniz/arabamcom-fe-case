import type { AdvertDetail, AdvertListItem, Property } from '@/types'
import { formatKm } from '@/utils/format'
import { Calendar, Gauge, Palette } from 'lucide-vue-next'
import { computed, type MaybeRef, unref } from 'vue'

type AdvertWithProperties = AdvertListItem | AdvertDetail | { properties?: Property[] }

export const useAdvertDisplay = (advert: MaybeRef<AdvertWithProperties | null | undefined>) => {
  const propertiesMap = computed(() => {
    const map = new Map<string, string>()
    const advertValue = unref(advert)
    if (advertValue?.properties) {
      for (const p of advertValue.properties) {
        map.set(p.name, p.value)
      }
    }
    return map
  })

  const getProperty = (name: string) => propertiesMap.value.get(name)

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
    propertiesMap,
    advertProperties,
  }
}
