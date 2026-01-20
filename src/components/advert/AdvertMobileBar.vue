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
    <div class="flex items-center justify-between gap-4">
      <div class="flex flex-col">
        <span class="text-xs text-gray-500 sm:text-sm dark:text-gray-400">{{
          t('detail.price')
        }}</span>
        <div class="text-primary text-xl font-black tracking-tight sm:text-2xl">
          {{ advert.priceFormatted }}
        </div>
      </div>

      <div class="flex flex-col items-end gap-1">
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">
          {{ advert.userInfo.nameSurname }}
        </span>
        <a
          :href="phoneRevealed ? `tel:${advert.userInfo.phone}` : 'javascript:void(0)'"
          class="btn-primary flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold shadow-md transition-all active:scale-95"
          @click="handlePhoneClick">
          <Phone :size="16" />
          <span>{{
            phoneRevealed ? advert.userInfo.phoneFormatted : t('detail.show_number')
          }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
