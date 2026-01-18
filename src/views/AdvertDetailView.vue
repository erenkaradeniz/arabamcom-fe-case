<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAdvertDetail } from '@/composables/useAdverts'
import { useI18n } from 'vue-i18n'
import { getAdvertImage } from '@/utils/image'
import { PhotoSizes } from '@/types'

const { t } = useI18n()
const route = useRoute()
const advertId = Number(route.params.id)

const { data: advert, isLoading, isError } = useAdvertDetail(advertId)
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div v-if="isLoading" class="py-20 text-center text-gray-500">{{ t('detail.loading') }}</div>

    <div v-else-if="isError || !advert" class="py-20 text-center text-red-500">
      {{ t('detail.not_found') }}
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold text-text-main mb-4">{{ advert.title }}</h1>

      <div class="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-6 relative group">
        <img
          v-if="advert.photos && advert.photos.length > 0"
          :src="getAdvertImage(advert.photos[0], PhotoSizes.ExtraLarge)"
          class="w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition cursor-pointer"
        >
          <span class="text-white font-bold">{{ t('detail.fullscreen') }}</span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-soft">
        <div class="text-xl font-bold text-primary mb-4">{{ advert.priceFormatted }}</div>
        <div class="text-gray-700" v-html="advert.text"></div>
      </div>
    </div>
  </div>
</template>
