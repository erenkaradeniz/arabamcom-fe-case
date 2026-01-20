<script setup lang="ts">
  import AdvertCard from '@/components/advert/AdvertCard.vue'
  import AdvertMobileBar from '@/components/advert/AdvertMobileBar.vue'
  import AdvertSellerCard from '@/components/advert/AdvertSellerCard.vue'
  import SmartImage from '@/components/common/SmartImage.vue'
  import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
  import {
    useAdvertDetail,
    useAppNavigation,
    useElementVisibility,
    useGallery,
  } from '@/composables'
  import advertService from '@/services/advertService'
  import { PhotoSizes, type AdvertListItem, type PhotoSizeType } from '@/types'
  import { getAdvertImage } from '@/utils/image'
  import { useTitle } from '@vueuse/core'
  import {
    ArrowLeft,
    Calendar,
    Camera,
    CarFront,
    ChevronLeft,
    ChevronRight,
    Fuel,
    Gauge,
    Palette,
    Settings,
    ShieldCheck,
    X,
  } from 'lucide-vue-next'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()
  const route = useRoute()
  const advertId = computed(() => Number(route.params.id))
  const isPhoneRevealed = ref(false)
  const sellerCardRef = ref<HTMLElement | null>(null)
  const { isVisible: isSellerCardVisible } = useElementVisibility(sellerCardRef, { threshold: 0.1 })

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

  const preferredLightboxSize = ref<PhotoSizeType>(PhotoSizes.Full)

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
      {
        label: t('detail.specs.model'),
        value: advert.value.modelName,
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
        value: advert.value.dateFormatted,
        icon: Calendar,
      },
    ].filter((spec) => spec.value)
  })

  const { goBack, returnToHome } = useAppNavigation()

  const similarAdverts = ref<AdvertListItem[]>([])
  const isSimilarLoading = ref(false)

  watch(
    () => ({ id: advert.value?.id, categoryId: advert.value?.category?.id }),
    async ({ id, categoryId }) => {
      if (!categoryId || !id) return

      try {
        isSimilarLoading.value = true
        const response = await advertService.getAdverts({
          categoryId: categoryId,
          take: 10,
        })
        similarAdverts.value = response.filter((a: AdvertListItem) => a.id !== id)
      } catch (e) {
        console.error('Failed to fetch similar adverts', e)
      } finally {
        isSimilarLoading.value = false
      }
    },
    { immediate: true }
  )

  const similarAdvertsScrollRef = ref<HTMLElement | null>(null)
  const similarAdvertsContainerRef = ref<HTMLElement | null>(null)

  const scrollToSimilar = () => {
    if (similarAdverts.value.length > 0 && similarAdvertsContainerRef.value) {
      similarAdvertsContainerRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const scrollLeft = () => {
    similarAdvertsScrollRef.value?.scrollBy({ left: -320, behavior: 'smooth' })
  }

  const scrollRight = () => {
    similarAdvertsScrollRef.value?.scrollBy({ left: 320, behavior: 'smooth' })
  }
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
        <span
          class="max-w-[200px] truncate font-medium text-gray-900 transition-colors dark:text-gray-200"
          :class="{
            'cursor-pointer hover:text-red-600 dark:hover:text-red-400': similarAdverts.length > 0,
          }"
          :title="advert.category.name"
          @click="scrollToSimilar">
          {{ advert.category.name }}
        </span>
        <ChevronRight :size="14" />
        <span
          class="max-w-[200px] truncate font-medium text-gray-900 dark:text-gray-200"
          :title="advert.modelName">
          {{ advert.modelName }}
        </span>
      </nav>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div class="flex flex-col gap-6 lg:col-span-8">
          <div class="surface p-4">
            <div
              class="gallery-main relative mb-4 flex cursor-zoom-in items-center justify-center overflow-hidden rounded-lg bg-black"
              @click="openLightbox(activePhotoIndex)">
              <div
                v-if="activePhoto"
                class="absolute inset-0 z-0 scale-110 bg-cover bg-center opacity-50 blur-xl transition-all duration-500"
                :style="{
                  backgroundImage: `url(${getAdvertImage(activePhoto, PhotoSizes.Small)})`,
                }"></div>

              <img
                v-if="activePhoto"
                :src="getAdvertImage(activePhoto, PhotoSizes.ExtraLarge)"
                :alt="advert.title"
                class="relative z-10 h-full w-full object-contain transition-opacity duration-300" />

              <div
                class="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-bold shadow-sm backdrop-blur dark:bg-black/60">
                <Camera :size="16" />
                {{ activePhotoIndex + 1 }}/{{ totalPhotos }}
              </div>

              <button
                v-if="totalPhotos > 1"
                @click.stop="prevPhoto"
                class="absolute top-1/2 left-2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70">
                <ChevronLeft :size="24" />
              </button>

              <button
                v-if="totalPhotos > 1"
                @click.stop="nextPhoto"
                class="absolute top-1/2 right-2 z-20 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-md transition-opacity hover:bg-white dark:bg-black/70">
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
                ">
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

          <div class="surface overflow-hidden p-0">
            <h3 class="section-title border-0 px-6 pt-6">{{ t('detail.specifications') }}</h3>
            <div class="p-6 pt-2">
              <div class="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-3">
                <div
                  v-for="(spec, index) in specifications"
                  :key="index"
                  class="flex items-center gap-3">
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

          <div class="surface">
            <h3 class="section-title">{{ t('detail.description') }}</h3>
            <div
              class="prose prose-stone dark:prose-invert max-w-none leading-relaxed text-gray-700 dark:text-gray-300"
              v-html="advert.text"></div>
          </div>
        </div>

        <div class="lg:col-span-4">
          <div class="sticky top-24 z-40 space-y-6">
            <AdvertSellerCard
              ref="sellerCardRef"
              :advert="advert"
              v-model:phone-revealed="isPhoneRevealed" />

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

      <AdvertMobileBar
        :advert="advert"
        :is-visible="!isSellerCardVisible"
        v-model:phone-revealed="isPhoneRevealed" />

      <div
        v-if="isSimilarLoading || similarAdverts.length > 0"
        ref="similarAdvertsContainerRef"
        class="mt-8 lg:mt-12">
        <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          {{ t('detail.similar_adverts') }}
        </h3>

        <div v-if="isSimilarLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <BaseSkeleton v-for="n in 4" :key="n" height="20rem" />
        </div>

        <div v-else class="relative">
          <button
            @click="scrollLeft"
            class="absolute top-1/2 -left-4 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-50 md:flex dark:bg-slate-800 dark:hover:bg-slate-700">
            <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
          </button>

          <div
            ref="similarAdvertsScrollRef"
            class="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-0">
            <div
              v-for="similar in similarAdverts"
              :key="similar.id"
              class="max-w-[280px] min-w-[280px] sm:max-w-[300px] sm:min-w-[300px]">
              <AdvertCard
                :advert="similar"
                :index="0"
                @click="$router.push({ name: 'advert-detail', params: { id: similar.id } })" />
            </div>
          </div>

          <button
            @click="scrollRight"
            class="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-50 md:flex dark:bg-slate-800 dark:hover:bg-slate-700">
            <ChevronRight :size="24" class="text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>

      <div class="h-20 lg:hidden"></div>
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
              v-for="(_, index) in advert?.photos"
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
    border-radius: 0.5rem;
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

  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: opacity 0.3s ease;
  }

  .lightbox-enter-from,
  .lightbox-leave-to {
    opacity: 0;
  }

  .lightbox-fade-enter-active,
  .lightbox-fade-leave-active {
    transition: opacity 0.3s ease;
  }

  .lightbox-fade-enter-from,
  .lightbox-fade-leave-to {
    opacity: 0;
  }
</style>
