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
    class="group bg-card-light shadow-soft hover:shadow-lift relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent transition-all duration-300 hover:border-gray-100 md:flex-row dark:bg-[#1e1e1e] dark:hover:border-gray-700">
    <div
      class="relative w-full shrink-0 overflow-hidden bg-gray-200 md:h-[200px] md:w-[320px]"
      style="aspect-ratio: 16/10"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave">
      <SmartImage
        :src="advert.photo"
        :alt="advert.title"
        :preferred-size="PhotoSizes.Large"
        :lazy="!isAboveFold"
        :aspect-ratio="'16/10'"
        image-class="transition-transform duration-700"
        :image-style="transformStyle"
        class="h-full w-full"
        :class="{ 'opacity-0': !advert.photo }" />

      <div
        v-if="advert.price > 2000000"
        class="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 text-[10px] font-bold tracking-wider text-gray-800 uppercase shadow-sm backdrop-blur-sm dark:bg-black/80 dark:text-gray-200">
        {{ t('common.premium') }}
      </div>
    </div>

    <div
      class="flex flex-grow flex-col justify-center border-b border-gray-100 p-4 md:border-r md:border-b-0 md:p-6 dark:border-gray-800">
      <h3
        class="text-text-main group-hover:text-primary mb-2 text-lg font-bold transition-colors md:text-xl dark:text-white">
        {{ advert.title }}
      </h3>

      <div class="text-text-muted mb-4 flex flex-wrap items-center gap-2 text-sm font-medium">
        <span
          v-for="prop in advertProperties"
          :key="prop.label"
          class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
          <component :is="prop.icon" :size="18" />
          {{ prop.value }}
        </span>
      </div>

      <div class="text-text-muted flex items-center gap-2 text-sm">
        <MapPin :size="18" class="shrink-0 text-gray-400" />
        <span class="truncate"
          >{{ advert.location.cityName }} / {{ advert.location.townName }}</span
        >
        <span class="mx-1 shrink-0 text-gray-300">•</span>
        <span class="shrink-0 whitespace-nowrap">{{ advert.dateFormatted }}</span>
      </div>
    </div>

    <div
      class="flex w-full flex-row items-center justify-between gap-4 p-4 md:w-[200px] md:flex-col md:items-end md:justify-center md:p-6">
      <p class="text-primary text-2xl font-extrabold">{{ advert.priceFormatted }}</p>
      <div
        class="group-hover:bg-primary flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500 transition-all group-hover:text-white dark:bg-gray-800">
        {{ t('common.detail') }}
        <ArrowRight :size="18" class="ml-1.5 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </div>
</template>
