<script setup lang="ts">
import SmartImage from '@/components/common/SmartImage.vue'
import { useAdvertDetail, useAppNavigation, useGallery } from '@/composables'
import { PhotoSizes } from '@/types'
import { getAdvertImage } from '@/utils/image'
import { useTitle } from '@vueuse/core'
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const advertId = Number(route.params.id)

const { data: advert, isLoading, isError } = useAdvertDetail(advertId)

useTitle(computed(() => advert.value?.title || 'Arabam.com'))

const totalPhotos = computed(() => advert.value?.photos?.length || 0)
const {
  activeIndex: activePhotoIndex,
  isOpen: isLightboxOpen,
  next: nextPhoto,
  prev: prevPhoto,
  open: openLightbox,
  close: closeLightbox,
} = useGallery(() => totalPhotos.value, { loop: true, enableKeyboard: true })

const activePhoto = computed(() => {
  if (!advert.value?.photos?.length) return null
  return advert.value.photos[activePhotoIndex.value]
})

const propertiesMap = computed(() => {
  const map = new Map<string, string>()
  if (advert.value?.properties) {
    for (const p of advert.value.properties) {
      map.set(p.name, p.value)
    }
  }
  return map
})

const getProperty = (name: string) => propertiesMap.value.get(name)

const specifications = computed(() => {
  if (!advert.value) return []
  return [
    [
      { label: t('detail.specs.category'), value: advert.value.category.name },
      { label: t('detail.specs.model'), value: advert.value.modelName },
    ],
    [
      { label: t('detail.specs.year'), value: getProperty('year') },
      { label: t('detail.specs.km'), value: getProperty('km') },
    ],
    [
      { label: t('detail.specs.fuel'), value: getProperty('fuel') },
      { label: t('detail.specs.gear'), value: getProperty('gear') },
    ],
    [
      { label: t('detail.specs.color'), value: getProperty('color') },
      { label: t('detail.specs.date'), value: advert.value.dateFormatted },
    ],
  ]
})

const { goBack, returnToHome } = useAppNavigation()
</script>

<template>
  <div>
    <div v-if="isLoading" class="flex flex-col gap-8">
      <BaseSkeleton width="12rem" height="2rem" />
      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div class="flex flex-col gap-6 lg:col-span-8">
          <BaseSkeleton height="25rem" />
          <BaseSkeleton height="18.75rem" />
        </div>
        <div class="lg:col-span-4">
          <BaseSkeleton height="25rem" />
        </div>
      </div>
    </div>

    <div v-else-if="isError || !advert" class="surface py-20 text-center">
      <p class="mb-4 text-lg text-red-500">{{ t('detail.not_found') }}</p>
      <button @click="goBack" class="btn-secondary">
        <ArrowLeft :size="18" />
        {{ t('detail.go_back') }}
      </button>
    </div>

    <div v-else>
      <nav class="breadcrumb mb-6">
        <a href="/" @click.prevent="returnToHome" class="breadcrumb-link">{{ t('nav.home') }}</a>
        <ChevronRight :size="14" />
        <span class="font-medium text-gray-900 dark:text-gray-200">{{ advert.category.name }}</span>
        <ChevronRight :size="14" />
        <span class="font-medium text-gray-900 dark:text-gray-200">{{ advert.modelName }}</span>
      </nav>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div class="flex flex-col gap-6 lg:col-span-8">
          <div class="surface p-4">
            <div
              class="gallery-main relative mb-4 flex items-center justify-center overflow-hidden rounded-lg bg-black cursor-zoom-in"
              @click="openLightbox(activePhotoIndex)"
            >
              <div
                v-if="activePhoto"
                class="absolute inset-0 z-0 bg-cover bg-center opacity-50 blur-xl scale-110 transition-all duration-500"
                :style="{
                  backgroundImage: `url(${getAdvertImage(activePhoto, PhotoSizes.Small)})`,
                }"
              ></div>

              <img
                v-if="activePhoto"
                :src="getAdvertImage(activePhoto, PhotoSizes.ExtraLarge)"
                :alt="advert.title"
                class="relative z-10 h-full w-full object-contain transition-opacity duration-300"
              />

              <div
                class="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur dark:bg-black/60"
              >
                <Camera :size="16" />
                {{ activePhotoIndex + 1 }}/{{ totalPhotos }}
              </div>

              <button
                v-if="totalPhotos > 1"
                @click.stop="prevPhoto"
                class="absolute left-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70"
              >
                <ChevronLeft :size="24" />
              </button>

              <button
                v-if="totalPhotos > 1"
                @click.stop="nextPhoto"
                class="absolute right-2 top-1/2 z-20 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70"
              >
                <ChevronRight :size="24" />
              </button>
            </div>

            <div class="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
              <button
                v-for="(photo, index) in advert.photos"
                :key="index"
                @click="activePhotoIndex = index"
                :class="
                  index === activePhotoIndex ? 'gallery-thumbnail-active' : 'gallery-thumbnail'
                "
              >
                <img
                  :src="getAdvertImage(photo, PhotoSizes.Thumbnail)"
                  :alt="`${advert.title} - ${index + 1}`"
                  class="h-full w-full object-cover"
                />
              </button>
            </div>
          </div>

          <div class="surface overflow-hidden p-0">
            <h3 class="section-title border-0 px-6 pt-6">{{ t('detail.specifications') }}</h3>
            <div>
              <div v-for="(row, rowIndex) in specifications" :key="rowIndex" class="spec-row">
                <template v-for="(spec, specIndex) in row" :key="specIndex">
                  <div class="spec-label">{{ spec.label }}</div>
                  <div class="spec-value">{{ spec.value || '-' }}</div>
                </template>
              </div>
            </div>
          </div>

          <div class="surface">
            <h3 class="section-title">{{ t('detail.description') }}</h3>
            <div
              class="prose prose-stone max-w-none leading-relaxed text-gray-700 dark:prose-invert dark:text-gray-300"
              v-html="advert.text"
            ></div>
          </div>
        </div>

        <div class="lg:col-span-4">
          <div class="sticky top-24 z-40 space-y-6">
            <div class="seller-card">
              <h1 class="mb-2 text-2xl font-black leading-tight text-gray-900 dark:text-white">
                {{ advert.title }}
              </h1>

              <div class="mb-6 flex flex-wrap items-center gap-2">
                <span class="tag">{{ advert.category.name }}</span>
                <span v-if="getProperty('fuel')" class="tag">{{ getProperty('fuel') }}</span>
                <span v-if="getProperty('gear')" class="tag">{{ getProperty('gear') }}</span>
                <span v-if="getProperty('year')" class="tag">{{ getProperty('year') }}</span>
              </div>

              <div class="mb-6">
                <div class="price-display">{{ advert.priceFormatted }}</div>
              </div>

              <a :href="`tel:${advert.userInfo.phone}`" class="btn-call">
                <Phone :size="20" />
                {{ t('detail.call_seller') }}
              </a>

              <div class="mt-6 border-t border-gray-100 pt-6 dark:border-gray-800">
                <div class="flex items-center gap-4">
                  <div
                    class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-lg font-bold text-gray-600"
                  >
                    {{ advert.userInfo.nameSurname.charAt(0) }}
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="truncate font-bold text-gray-900 dark:text-white">
                      {{ advert.userInfo.nameSurname }}
                    </h4>
                    <div class="text-sm text-gray-500">{{ advert.userInfo.phoneFormatted }}</div>
                  </div>
                </div>

                <div class="mt-4 flex items-start gap-2 text-sm text-gray-500">
                  <MapPin :size="18" class="mt-0.5 text-gray-400" />
                  <p class="leading-snug">
                    {{ advert.location.cityName }}, {{ advert.location.townName }}
                    <br />
                    <span class="flex items-center gap-1 text-xs text-gray-400">
                      <Calendar :size="12" />
                      {{ advert.dateFormatted }}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div class="info-box">
              <div class="flex items-start gap-3">
                <ShieldCheck :size="20" class="text-blue-600 dark:text-blue-400" />
                <div>
                  <h5 class="mb-1 text-sm font-bold text-blue-900 dark:text-blue-100">
                    {{ t('detail.safety_title') }}
                  </h5>
                  <p class="text-xs leading-snug text-blue-800 dark:text-blue-200/80">
                    {{ t('detail.safety_text') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="isLightboxOpen && activePhoto"
          class="lightbox-overlay"
          @click.self="closeLightbox"
        >
          <button
            @click="closeLightbox"
            class="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X :size="24" />
          </button>

          <div
            class="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur"
          >
            <Camera :size="16" />
            {{ activePhotoIndex + 1 }} / {{ totalPhotos }}
          </div>

          <button @click="prevPhoto" class="lightbox-nav left-4">
            <ChevronLeft :size="32" />
          </button>

          <div class="relative flex h-full w-full items-center justify-center overflow-hidden">
            <div
              class="absolute inset-0 z-0 bg-cover bg-center opacity-60 blur-3xl scale-110"
              :style="{ backgroundImage: `url(${getAdvertImage(activePhoto, PhotoSizes.Small)})` }"
            ></div>

            <SmartImage
              :src="activePhoto"
              :alt="advert?.title"
              :preferred-size="PhotoSizes.Full"
              :aspect-ratio="'auto'"
              object-fit="contain"
              transparent
              class="lightbox-image relative z-10 h-full w-full"
            />
          </div>

          <button @click="nextPhoto" class="lightbox-nav right-4">
            <ChevronRight :size="32" />
          </button>

          <div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            <button
              v-for="(_, index) in advert?.photos"
              :key="index"
              @click="activePhotoIndex = index"
              :class="[
                'h-2 w-2 rounded-full transition-all',
                index === activePhotoIndex ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60',
              ]"
            ></button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.95);
}

.lightbox-image {
  max-width: 90vw;
  max-height: 85vh;
  object-fit: contain;
  border-radius: 0.5rem;
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  color: white;
  transition: background-color 0.2s;
  cursor: pointer;
}

.lightbox-nav:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
