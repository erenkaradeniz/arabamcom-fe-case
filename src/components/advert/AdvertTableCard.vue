<script setup lang="ts">
  import SmartImage from '@/components/common/SmartImage.vue'
  import { useAdvertDisplay, useParallax } from '@/composables'
  import { PhotoSizes, type AdvertListItem } from '@/types'
  import { formatKm } from '@/utils/format'

  const props = defineProps<{
    advert: AdvertListItem
    index?: number
  }>()

  const { getProperty } = useAdvertDisplay(props.advert)

  const { transformStyle, handleMouseMove, handleMouseLeave } = useParallax()
</script>

<template>
  <div
    class="advert-table-grid group relative cursor-pointer overflow-hidden rounded-xl border border-transparent bg-white px-4 py-3 text-sm shadow-sm transition-all duration-300 hover:border-gray-100 hover:bg-gray-50 hover:shadow-md md:rounded-none md:border-b-gray-100 md:shadow-none md:hover:border-b-gray-100 dark:bg-[#1e293b] dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:md:border-b-slate-800 dark:md:hover:border-b-slate-700">
    <div
      class="relative h-[80px] w-full overflow-hidden rounded-lg bg-gray-200"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave">
      <SmartImage
        :src="advert.photo"
        :alt="advert.title"
        :preferred-size="PhotoSizes.Thumbnail"
        class="h-full w-full object-cover transition-transform duration-700 ease-out will-change-transform"
        :style="transformStyle" />
    </div>

    <div class="truncate font-medium text-gray-900 dark:text-white">
      {{ advert.modelName }}
    </div>

    <div class="line-clamp-2 text-gray-600 dark:text-gray-300">
      {{ advert.title }}
    </div>

    <div class="text-gray-900 dark:text-white">
      {{ getProperty('year') }}
    </div>

    <div class="text-gray-900 dark:text-white">
      {{ getProperty('km') ? formatKm(Number(getProperty('km'))) : '-' }}
    </div>
    <div class="truncate text-gray-900 dark:text-white">
      {{ getProperty('color') }}
    </div>

    <div class="font-bold text-red-600 dark:text-red-400">
      {{ advert.priceFormatted }}
    </div>
    <div class="text-xs text-gray-500 md:text-sm">
      {{ advert.dateFormatted }}
    </div>

    <div class="truncate text-xs text-gray-500 md:text-sm">
      {{ advert.location.cityName }}
      <br />
      {{ advert.location.townName }}
    </div>
  </div>
</template>
