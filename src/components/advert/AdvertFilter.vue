<script setup lang="ts">
  import AdvertFilterForm from '@/components/advert/AdvertFilterForm.vue'
  import BaseDrawer from '@/components/ui/BaseDrawer.vue'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    isOpen: boolean
    initialMinYear?: number
    initialMaxYear?: number
    initialMinDate?: string
    initialMaxDate?: string
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
    (
      e: 'apply',
      filters: {
        minYear?: number
        maxYear?: number
        minDate?: string
        maxDate?: string
      }
    ): void
    (e: 'reset'): void
  }>()

  const { t } = useI18n()

  const minYear = ref<string | number>('')
  const maxYear = ref<string | number>('')
  const minDate = ref<string>('')
  const maxDate = ref<string>('')

  watch(
    () => props.isOpen,
    (newVal) => {
      if (newVal) {
        minYear.value = props.initialMinYear || ''
        maxYear.value = props.initialMaxYear || ''
        minDate.value = props.initialMinDate || ''
        maxDate.value = props.initialMaxDate || ''
      }
    }
  )

  const handleApply = () => {
    emit('apply', {
      minYear: minYear.value ? Number(minYear.value) : undefined,
      maxYear: maxYear.value ? Number(maxYear.value) : undefined,
      minDate: minDate.value || undefined,
      maxDate: maxDate.value || undefined,
    })
  }

  const handleReset = () => {
    minYear.value = ''
    maxYear.value = ''
    minDate.value = ''
    maxDate.value = ''
    emit('reset')
  }
</script>

<template>
  <BaseDrawer :is-open="isOpen" :title="t('home.filter')" @close="emit('close')">
    <template #header-action>
      <button
        v-if="minYear || maxYear || minDate || maxDate"
        @click="handleReset"
        class="mr-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
        {{ t('home.clear') }}
      </button>
    </template>

    <AdvertFilterForm
      v-model:min-year="minYear"
      v-model:max-year="maxYear"
      v-model:min-date="minDate"
      v-model:max-date="maxDate" />

    <template #footer>
      <button @click="handleApply" class="btn-primary w-full">
        {{ t('home.apply') }}
      </button>
    </template>
  </BaseDrawer>
</template>
