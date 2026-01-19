<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import { useParallax } from '@/composables'
import type { AdvertListItem } from '@/types'
import { PhotoSizes } from '@/types'
import { formatKm } from '@/utils/format'
import { ArrowRight, Calendar, Gauge, MapPin, Palette } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  advert: AdvertListItem
  index?: number
}>()

const getProperty = (name: string) => {
  return props.advert.properties?.find((p) => p.name === name)?.value
}

const isAboveFold = (props.index ?? 0) < 3

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
    class="group relative flex flex-col md:flex-row overflow-hidden rounded-xl bg-card-light dark:bg-[#1e1e1e] shadow-soft transition-all duration-300 hover:shadow-lift cursor-pointer border border-transparent hover:border-gray-100 dark:hover:border-gray-700"
  >
    <div
      class="relative w-full md:w-[320px] md:h-[200px] shrink-0 overflow-hidden bg-gray-200"
      style="aspect-ratio: 16/10"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
    >
      <SmartImage
        :src="advert.photo"
        :alt="advert.title"
        :preferred-size="PhotoSizes.Large"
        :lazy="!isAboveFold"
        :aspect-ratio="'16/10'"
        image-class="transition-transform duration-700"
        :image-style="transformStyle"
        class="h-full w-full"
        :class="{ 'opacity-0': !advert.photo }"
      />

      <div
        v-if="advert.price > 2000000"
        class="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200 shadow-sm"
      >
        {{ t('common.premium') }}
      </div>
    </div>

    <div
      class="flex-grow p-4 md:p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800"
    >
      <h3
        class="text-lg md:text-xl font-bold text-text-main dark:text-white mb-2 group-hover:text-primary transition-colors"
      >
        {{ advert.title }}
      </h3>

      <div class="flex flex-wrap items-center gap-2 mb-4 text-sm font-medium text-text-muted">
        <span
          v-for="prop in advertProperties"
          :key="prop.label"
          class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg"
        >
          <component :is="prop.icon" :size="18" />
          {{ prop.value }}
        </span>
      </div>

      <div class="flex items-center gap-2 text-sm text-text-muted">
        <MapPin :size="18" class="text-gray-400 shrink-0" />
        <span class="truncate"
          >{{ advert.location.cityName }} / {{ advert.location.townName }}</span
        >
        <span class="mx-1 text-gray-300 shrink-0">•</span>
        <span class="whitespace-nowrap shrink-0">{{ advert.dateFormatted }}</span>
      </div>
    </div>

    <div
      class="w-full md:w-[200px] p-4 md:p-6 flex flex-row md:flex-col justify-between items-center md:items-end md:justify-center gap-4"
    >
      <p class="text-2xl font-extrabold text-primary">{{ advert.priceFormatted }}</p>
      <div
        class="flex items-center text-sm font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl group-hover:bg-primary group-hover:text-white transition-all"
      >
        {{ t('common.detail') }}
        <ArrowRight :size="18" class="ml-1.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
</template>
