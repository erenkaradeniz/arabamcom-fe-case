<script setup lang="ts">
import type { AdvertListItem } from '@/types'
import { PhotoSizes } from '@/types'
import { formatPrice, formatKm } from '@/utils/format'
import { getAdvertImage } from '@/utils/image'
import { useParallax } from '@/composables/useParallax'
import { Calendar, Gauge, Palette, MapPin, ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps<{
  advert: AdvertListItem
  index?: number
}>()

const getProperty = (name: string) => {
  return props.advert.properties?.find((p) => p.name === name)?.value
}

const isAboveFold = (props.index ?? 0) < 4

const { transformStyle, handleMouseMove, handleMouseLeave } = useParallax()

const advertProperties = computed(() => {
  const props = []
  const year = getProperty('year')
  if (year) props.push({ label: 'year', value: year, icon: Calendar })

  const km = getProperty('km')
  if (km) props.push({ label: 'km', value: formatKm(km), icon: Gauge })

  const color = getProperty('color')
  if (color) props.push({ label: 'color', value: color, icon: Palette })

  return props
})
</script>

<template>
  <div class="card-interactive group relative flex h-full flex-col">
    <div
      class="relative w-full overflow-hidden bg-gray-200"
      style="aspect-ratio: 4/3"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <img
        :src="getAdvertImage(advert.photo, PhotoSizes.Large)"
        :alt="advert.title"
        width="580"
        height="435"
        class="h-full w-full object-cover transition-transform duration-700"
        :style="transformStyle"
        :loading="isAboveFold ? 'eager' : 'lazy'"
        :fetchpriority="isAboveFold ? 'high' : 'auto'"
        decoding="async"
      />

      <div v-if="advert.price > 2000000" class="badge-premium">
        {{ t('common.premium') }}
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 md:p-5">
      <h3
        class="text-heading mb-2 line-clamp-1 text-base transition-colors group-hover:text-primary md:text-lg"
      >
        {{ advert.title }}
      </h3>

      <div class="mb-3 flex flex-wrap items-center gap-1.5">
        <span v-for="prop in advertProperties" :key="prop.label" class="tag">
          <component :is="prop.icon" :size="14" />
          {{ prop.value }}
        </span>
      </div>

      <div class="text-muted mb-4 flex items-center gap-1">
        <MapPin :size="16" class="text-gray-400" />
        <span>{{ advert.location.cityName }}, {{ advert.location.townName }}</span>
        <span class="mx-1 text-gray-300">•</span>
        <span class="whitespace-nowrap">{{ advert.dateFormatted }}</span>
      </div>

      <div
        class="mt-auto flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800"
      >
        <p class="text-xl font-bold text-primary">
          {{ formatPrice(advert.price) }}
        </p>
        <div
          class="flex items-center text-xs font-semibold text-gray-400 transition-colors group-hover:text-text-main"
        >
          {{ t('common.detail') }}
          <ArrowRight :size="16" class="ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  </div>
</template>
