<script setup lang="ts">
  import { useAdvertDisplay } from '@/composables'
  import type { AdvertDetail } from '@/types'
  import { Calendar, CarFront, Fuel, Gauge, Palette, Settings } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    advert: AdvertDetail
  }>()

  const { t } = useI18n()
  const { getProperty } = useAdvertDisplay(computed(() => props.advert))

  const specifications = computed(() => {
    return [
      {
        label: t('detail.specs.model'),
        value: props.advert.modelName,
        icon: CarFront,
      },
      {
        label: t('detail.specs.year'),
        value: getProperty('year'),
        icon: Calendar,
      },
      {
        label: t('detail.specs.km'),
        value: getProperty('km'),
        icon: Gauge,
      },
      {
        label: t('detail.specs.fuel'),
        value: getProperty('fuel'),
        icon: Fuel,
      },
      {
        label: t('detail.specs.gear'),
        value: getProperty('gear'),
        icon: Settings,
      },
      {
        label: t('detail.specs.color'),
        value: getProperty('color'),
        icon: Palette,
      },
      {
        label: t('detail.specs.date'),
        value: props.advert.dateFormatted,
        icon: Calendar,
      },
    ].filter((spec) => spec.value)
  })
</script>

<template>
  <div class="surface overflow-hidden p-0">
    <h3 class="section-title border-0 px-6 pt-6">{{ t('detail.specifications') }}</h3>
    <div class="p-6 pt-2">
      <div class="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3">
        <div v-for="(spec, index) in specifications" :key="index" class="flex items-center gap-3">
          <component
            :is="spec.icon"
            class="shrink-0 text-gray-400 dark:text-gray-500"
            :size="24"
            stroke-width="1.5" />
          <div>
            <div class="text-xs text-gray-500 dark:text-gray-400">{{ spec.label }}</div>
            <div class="font-semibold text-gray-900 dark:text-gray-100">
              {{ spec.value }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
