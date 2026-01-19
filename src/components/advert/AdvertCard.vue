<script setup lang="ts">
  import SmartImage from '@/components/common/SmartImage.vue'
  import { useParallax } from '@/composables'
  import { type AdvertListItem, PhotoSizes } from '@/types'
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
      @mouseleave="handleMouseLeave">
      <SmartImage
        :src="advert.photo"
        :alt="advert.title"
        :preferred-size="PhotoSizes.Large"
        :lazy="!isAboveFold"
        :aspect-ratio="'4/3'"
        image-class="transition-transform duration-700"
        :image-style="transformStyle"
        class="h-full w-full" />

      <div v-if="advert.price > 2000000" class="badge-premium">
        {{ t('common.premium') }}
      </div>
    </div>

    <div class="flex flex-1 flex-col p-4 md:p-5">
      <h3
        class="text-heading group-hover:text-primary mb-2 line-clamp-1 text-base transition-colors md:text-lg">
        {{ advert.title }}
      </h3>

      <div class="mb-3 flex flex-wrap items-center gap-1.5">
        <span v-for="prop in advertProperties" :key="prop.label" class="tag">
          <component :is="prop.icon" :size="14" />
          {{ prop.value }}
        </span>
      </div>

      <div class="text-muted mt-auto mb-4 flex w-full items-center justify-between gap-2">
        <div class="flex min-w-0 items-center gap-1">
          <MapPin :size="16" class="shrink-0 text-gray-400" />
          <span class="truncate"
            >{{ advert.location.cityName }}, {{ advert.location.townName }}</span
          >
        </div>
        <span class="shrink-0 text-xs whitespace-nowrap text-gray-400">{{
          advert.dateFormatted
        }}</span>
      </div>

      <div
        class="flex items-end justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
        <p class="text-primary text-xl font-bold">
          {{ advert.priceFormatted }}
        </p>
        <div
          class="group-hover:text-text-main flex items-center text-xs font-semibold text-gray-400 transition-colors">
          {{ t('common.detail') }}
          <ArrowRight :size="16" class="ml-0.5 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  </div>
</template>
