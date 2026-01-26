<script setup lang="ts">
  import AdvertMobileBar from '@/components/advert/AdvertMobileBar.vue'
  import AdvertSellerCard from '@/components/advert/AdvertSellerCard.vue'
  import AdvertGallery from '@/components/advert/detail/AdvertGallery.vue'
  import AdvertSimilar from '@/components/advert/detail/AdvertSimilar.vue'
  import AdvertSpecs from '@/components/advert/detail/AdvertSpecs.vue'
  import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
  import { useAdvertDetail, useAppNavigation, useElementVisibility } from '@/composables'
  import { useTitle } from '@vueuse/core'
  import { ArrowLeft, ChevronRight, ShieldCheck } from 'lucide-vue-next'
  import { computed, ref } from 'vue'
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

  const { goBack, returnToHome } = useAppNavigation()

  const similarRef = ref<InstanceType<typeof AdvertSimilar> | null>(null)

  const scrollToSimilar = () => {
    if (similarRef.value?.$el) {
      similarRef.value.$el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
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
          class="max-w-[200px] cursor-pointer truncate font-medium text-gray-900 transition-colors hover:text-red-600 dark:text-gray-200 dark:hover:text-red-400"
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
          <AdvertGallery :advert="advert" />

          <AdvertSpecs :advert="advert" />

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

      <AdvertSimilar
        ref="similarRef"
        :category-id="advert.category.id"
        :current-advert-id="advert.id" />

      <div class="h-20 lg:hidden"></div>
    </div>
  </div>
</template>
