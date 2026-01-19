<script setup lang="ts">
  import { type AdvertDetail } from '@/types'
  import { Phone } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    advert: AdvertDetail
    isVisible: boolean
    phoneRevealed: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:phoneRevealed', value: boolean): void
  }>()

  const { t } = useI18n()

  const handlePhoneClick = (e: MouseEvent) => {
    if (!props.phoneRevealed) {
      e.preventDefault()
      emit('update:phoneRevealed', true)
    }
  }
</script>

<template>
  <div
    :class="[
      'fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur-md transition-transform duration-300 ease-in-out lg:hidden dark:border-gray-700 dark:bg-slate-900/95',
      !isVisible ? 'translate-y-full' : 'translate-y-0',
    ]">
    <div class="flex items-center gap-3">
      <div class="text-primary shrink-0 text-xl font-black sm:text-2xl">
        {{ advert.priceFormatted }}
      </div>
      <div class="min-w-0 flex-1 text-right">
        <div class="mb-1 truncate text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
          {{ advert.userInfo.nameSurname }}
        </div>
        <a
          :href="phoneRevealed ? `tel:${advert.userInfo.phone}` : 'javascript:void(0)'"
          class="text-primary inline-flex items-center gap-1 text-sm font-medium sm:text-base"
          @click="handlePhoneClick">
          <Phone :size="16" class="hidden sm:block" />
          <Phone :size="14" class="sm:hidden" />
          {{ phoneRevealed ? advert.userInfo.phoneFormatted : t('detail.show_number') }}
        </a>
      </div>
    </div>
  </div>
</template>
