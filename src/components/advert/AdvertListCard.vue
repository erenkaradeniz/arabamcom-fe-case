<script setup lang="ts">
  import SmartImage from '@/components/common/SmartImage.vue'
  import { useAdvertDisplay, useParallax } from '@/composables'
  import type { AdvertListItem } from '@/types'
  import { PhotoSizes } from '@/types'
  import { ArrowRight, MapPin } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()

  const props = defineProps<{
    advert: AdvertListItem
    index?: number
  }>()

  const { advertProperties } = useAdvertDisplay(props.advert)

  const isAboveFold = (props.index ?? 0) < 3

  const { transformStyle, handleMouseMove, handleMouseLeave } = useParallax()
</script>

<template>
  <div
    class="group bg-card-light shadow-soft hover:shadow-lift relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-transparent transition-all duration-300 hover:border-gray-100 md:flex-row dark:bg-[#1e293b] dark:hover:border-slate-700">
    <div
      class="relative w-full shrink-0 overflow-hidden md:w-[220px] lg:w-[320px]"
      style="aspect-ratio: 16/10"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave">
      <SmartImage
        :src="advert.photo"
        :alt="advert.title"
        :preferred-size="PhotoSizes.Fit"
        :lazy="!isAboveFold"
        :aspect-ratio="'16/10'"
        image-class="transition-transform duration-700"
        :image-style="transformStyle"
        :transparent="true"
        object-fit="contain"
        class="h-full w-full bg-transparent!"
        :class="{ 'opacity-0': !advert.photo }" />
    </div>

    <div
      class="flex grow flex-col justify-center border-b border-gray-100 p-4 md:border-r md:border-b-0 md:p-4 lg:p-6 dark:border-slate-700">
      <h3
        class="text-text-main group-hover:text-primary mb-2 text-lg font-bold transition-colors md:text-lg lg:text-xl dark:text-white">
        {{ advert.title }}
      </h3>

      <div class="text-text-muted mb-4 flex flex-wrap items-center gap-4 text-sm font-medium">
        <span
          v-for="prop in advertProperties"
          :key="prop.label"
          class="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 dark:bg-slate-700 dark:text-gray-200">
          <component :is="prop.icon" :size="18" />
          {{ prop.value }}
        </span>
      </div>

      <div class="text-text-muted flex items-center gap-2 text-sm dark:text-gray-400">
        <MapPin :size="18" class="shrink-0 text-gray-400" />
        <span class="truncate"
          >{{ advert.location.cityName }} / {{ advert.location.townName }}</span
        >
        <span class="mx-1 shrink-0 text-gray-300 dark:text-gray-600">•</span>
        <span class="shrink-0 whitespace-nowrap">{{ advert.dateFormatted }}</span>
      </div>
    </div>

    <div
      class="flex w-full shrink-0 flex-row items-center justify-between gap-4 p-4 md:w-[160px] md:flex-col md:items-end md:justify-center md:p-4 lg:w-[200px] lg:p-6">
      <p class="text-primary text-xl font-extrabold lg:text-2xl">{{ advert.priceFormatted }}</p>
      <div
        class="group-hover:bg-primary flex items-center rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-500 transition-all group-hover:text-white dark:bg-slate-800 dark:text-gray-300 group-hover:dark:text-white">
        {{ t('common.detail') }}
        <ArrowRight :size="18" class="ml-1.5 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
  </div>
</template>
