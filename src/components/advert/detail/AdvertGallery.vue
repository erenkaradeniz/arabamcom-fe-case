<script setup lang="ts">
  import SmartImage from '@/components/common/SmartImage.vue'
  import { useGallery } from '@/composables'
  import type { AdvertDetail } from '@/types'
  import { PhotoSizes, type PhotoSizeType } from '@/types'
  import { getAdvertImage } from '@/utils/image'
  import { Camera, ChevronLeft, ChevronRight, X } from 'lucide-vue-next'
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    advert: AdvertDetail
  }>()

  const { t } = useI18n()

  const totalPhotos = computed(() => props.advert.photos.length)
  const {
    activeIndex: activePhotoIndex,
    isOpen: isLightboxOpen,
    next: nextPhoto,
    prev: prevPhoto,
    open: openLightbox,
    close: closeLightbox,
  } = useGallery(() => totalPhotos.value, { loop: true, enableKeyboard: true })

  const activePhoto = computed(() => {
    return props.advert.photos[activePhotoIndex.value]
  })

  const preferredLightboxSize = ref<PhotoSizeType>(PhotoSizes.Full)
</script>

<template>
  <div class="surface p-4">
    <div
      class="gallery-main relative mb-4 flex cursor-zoom-in items-center justify-center overflow-hidden rounded-lg bg-black"
      @click="openLightbox(activePhotoIndex)">
      <div
        class="absolute inset-0 z-0 scale-110 bg-cover bg-center opacity-50 blur-xl transition-all duration-500"
        :style="{
          backgroundImage: `url(${getAdvertImage(activePhoto, PhotoSizes.Small)})`,
        }"></div>

      <img
        :src="getAdvertImage(activePhoto, PhotoSizes.ExtraLarge)"
        :alt="advert.title"
        class="relative z-10 h-full w-full object-contain transition-opacity duration-300" />

      <div
        class="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur dark:bg-black/60 dark:text-white">
        <Camera :size="16" />
        {{ activePhotoIndex + 1 }}/{{ totalPhotos }}
      </div>

      <button
        v-if="totalPhotos > 1"
        @click.stop="prevPhoto"
        class="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70 dark:text-white">
        <ChevronLeft :size="24" />
      </button>

      <button
        v-if="totalPhotos > 1"
        @click.stop="nextPhoto"
        class="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70 dark:text-white">
        <ChevronRight :size="24" />
      </button>
    </div>

    <div class="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
      <button
        v-for="(photo, index) in advert.photos"
        :key="index"
        @click="activePhotoIndex = index"
        :class="[
          'relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 transition-all',
          index === activePhotoIndex
            ? 'border-primary ring-primary opacity-100 ring-2'
            : 'border-transparent opacity-60 hover:opacity-100',
        ]">
        <SmartImage
          :src="photo"
          :alt="`${advert.title} - ${index + 1}`"
          :preferred-size="PhotoSizes.Thumbnail"
          aspect-ratio="unset"
          class="h-full w-full"
          image-class="h-full w-full"
          object-fit="cover" />
      </button>
    </div>
  </div>

  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="isLightboxOpen && activePhoto"
        class="lightbox-overlay"
        @click.self="closeLightbox">
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white backdrop-blur transition-colors hover:bg-white/20">
          <X :size="24" />
        </button>

        <div
          class="absolute top-4 left-4 z-50 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur">
          <Camera :size="16" />
          {{ activePhotoIndex + 1 }} / {{ totalPhotos }}
        </div>

        <button @click="prevPhoto" class="lightbox-nav left-4">
          <ChevronLeft :size="32" />
        </button>

        <div class="relative flex h-full w-full items-center justify-center overflow-hidden">
          <div
            class="absolute inset-0 z-0 scale-110 bg-black bg-cover bg-center opacity-60 blur-3xl transition-all duration-300"
            :style="{
              backgroundImage: `url(${getAdvertImage(activePhoto, PhotoSizes.Small)})`,
            }"></div>

          <div
            class="absolute inset-y-0 left-0 z-20 w-1/2 cursor-pointer"
            @click.stop="prevPhoto"
            :title="t('common.prev')"></div>
          <div
            class="absolute inset-y-0 right-0 z-20 w-1/2 cursor-pointer"
            @click.stop="nextPhoto"
            :title="t('common.next')"></div>

          <Transition name="lightbox-fade">
            <img
              :key="activePhotoIndex"
              :src="getAdvertImage(activePhoto, preferredLightboxSize)"
              :alt="advert?.title"
              class="absolute inset-0 z-10 h-full w-full object-contain p-4 lg:p-10" />
          </Transition>
        </div>

        <button @click="nextPhoto" class="lightbox-nav right-4">
          <ChevronRight :size="32" />
        </button>

        <div class="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            v-for="(_, index) in advert.photos"
            :key="index"
            @click="activePhotoIndex = index"
            :class="[
              'h-2 w-2 rounded-full transition-all',
              index === activePhotoIndex ? 'w-6 bg-white' : 'bg-white/40 hover:bg-white/60',
            ]"></button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .gallery-main {
    aspect-ratio: 16/9;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 50;
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
</style>
