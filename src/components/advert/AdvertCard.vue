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
  <div
    class="group relative flex flex-col overflow-hidden rounded-xl bg-card-light dark:bg-[#1e1e1e] shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700 h-full"
  >
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

      <div
        v-if="advert.price > 2000000"
        class="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 shadow-sm"
      >
        {{ t('common.premium') }}
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 md:p-5">
      <h3
        class="text-base md:text-lg font-bold text-text-main dark:text-white line-clamp-1 mb-2 group-hover:text-primary transition-colors"
      >
        {{ advert.title }}
      </h3>

      <div class="flex flex-wrap items-center gap-1.5 mb-3 text-xs font-medium text-text-muted">
        <span
          v-for="prop in advertProperties"
          :key="prop.label"
          class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"
        >
          <component :is="prop.icon" :size="14" />
          {{ prop.value }}
        </span>
      </div>

      <div class="flex items-center gap-1 text-xs text-text-muted mb-4">
        <MapPin :size="16" class="text-gray-400" />
        <span>{{ advert.location.cityName }}, {{ advert.location.townName }}</span>
        <span class="mx-1 text-gray-300">•</span>
        <span class="whitespace-nowrap">{{ advert.dateFormatted }}</span>
      </div>

      <div
        class="mt-auto flex items-end justify-between border-t border-gray-100 dark:border-gray-800 pt-4"
      >
        <p class="text-xl font-bold text-primary">
          {{ formatPrice(advert.price) }}
        </p>
        <div
          class="flex items-center text-xs font-semibold text-gray-400 group-hover:text-text-main transition-colors"
        >
          {{ t('common.detail') }}
          <ArrowRight :size="16" class="ml-0.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  </div>
</template>
