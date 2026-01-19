<script setup lang="ts">
  import { type AdvertDetail } from '@/types'
  import { MapPin, Phone } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    advert: AdvertDetail
    phoneRevealed: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:phoneRevealed', value: boolean): void
  }>()

  const { t } = useI18n()

  const propertyMap = computed(() => {
    const map = new Map<string, string>()
    if (props.advert.properties) {
      for (const p of props.advert.properties) {
        map.set(p.name, p.value)
      }
    }
    return map
  })

  const getProperty = (name: string) => propertyMap.value.get(name)

  const handlePhoneClick = (e: MouseEvent) => {
    if (!props.phoneRevealed) {
      e.preventDefault()
      emit('update:phoneRevealed', true)
    }
  }
</script>

<template>
  <div class="seller-card">
    <h1 class="mb-2 text-2xl leading-tight font-black text-gray-900 dark:text-white">
      {{ advert.title }}
    </h1>

    <div class="mb-4 flex flex-wrap items-center gap-2">
      <span v-if="getProperty('fuel')" class="tag">{{ getProperty('fuel') }}</span>
      <span v-if="getProperty('gear')" class="tag">{{ getProperty('gear') }}</span>
      <span v-if="getProperty('year')" class="tag">{{ getProperty('year') }}</span>
      <span v-if="getProperty('km')" class="tag">{{ getProperty('km') }} km</span>
      <span v-if="getProperty('color')" class="tag">{{ getProperty('color') }}</span>
    </div>

    <a
      :href="`https://www.google.com/maps/search/?api=1&query=${advert.location.cityName}+${advert.location.townName}`"
      target="_blank"
      rel="noopener noreferrer"
      class="group mb-6 flex w-fit items-center gap-2 rounded-lg py-1 pr-3 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20">
      <MapPin
        :size="18"
        class="mt-0.5 text-blue-600 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300" />
      <span
        class="leading-snug text-blue-600 transition-colors group-hover:text-blue-800 dark:text-blue-400 dark:group-hover:text-blue-300">
        {{ advert.location.cityName }} - {{ advert.location.townName }}
      </span>
    </a>

    <div class="mb-6 border-b border-gray-100 dark:border-gray-800"></div>

    <div class="mb-6">
      <div class="price-display">{{ advert.priceFormatted }}</div>
    </div>

    <div class="mt-6 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-lg font-bold text-gray-600">
          {{ advert.userInfo.nameSurname.charAt(0) }}
        </div>
        <div class="min-w-0 flex-1">
          <h4 class="truncate font-bold text-gray-900 dark:text-white">
            {{ advert.userInfo.nameSurname }}
          </h4>
        </div>
      </div>
    </div>

    <a
      :href="phoneRevealed ? `tel:${advert.userInfo.phone}` : 'javascript:void(0)'"
      class="btn-call"
      @click="handlePhoneClick">
      <Phone :size="20" />
      {{ phoneRevealed ? advert.userInfo.phoneFormatted : t('detail.show_number') }}
    </a>
  </div>
</template>
