<script setup lang="ts">
  import BaseAccordion from '@/components/ui/BaseAccordion.vue'
  import { VueDatePicker } from '@vuepic/vue-datepicker'
  import { enUS, tr } from 'date-fns/locale'
  import { computed, reactive } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = withDefaults(
    defineProps<{
      minYear?: string | number
      maxYear?: string | number
      minDate?: string
      maxDate?: string
    }>(),
    {
      minYear: '',
      maxYear: '',
      minDate: '',
      maxDate: '',
    }
  )

  const emit = defineEmits<{
    (e: 'update:minYear', value: string | number): void
    (e: 'update:maxYear', value: string | number): void
    (e: 'update:minDate', value: string): void
    (e: 'update:maxDate', value: string): void
  }>()

  const { t, locale } = useI18n()

  const datePickerLocales = reactive({
    tr,
    en: enUS,
  })

  const currentLocale = computed(() => {
    return datePickerLocales[locale.value as keyof typeof datePickerLocales] || tr
  })

  const currentYear = new Date().getFullYear()
  const startYear = 1956
  const yearOptions = Array.from({ length: currentYear - startYear + 1 }, (_, i) => currentYear - i)

  const minYearOptions = computed(() => {
    const max = props.maxYear ? Number(props.maxYear) : Infinity
    return yearOptions.filter((year) => year <= max).sort((a, b) => a - b)
  })

  const maxYearOptions = computed(() => {
    const min = props.minYear ? Number(props.minYear) : -Infinity
    return yearOptions.filter((year) => year >= min).sort((a, b) => b - a)
  })

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const resetYear = () => {
    emit('update:minYear', '')
    emit('update:maxYear', '')
  }

  const resetDate = () => {
    emit('update:minDate', '')
    emit('update:maxDate', '')
  }
</script>

<template>
  <div class="space-y-4">
    <BaseAccordion :title="t('home.year')">
      <template #header-action="{ isOpen }">
        <span v-if="!isOpen && (minYear || maxYear)" class="text-sm font-normal text-gray-500">
          {{ minYear || startYear }} - {{ maxYear || currentYear }}
        </span>
        <button
          v-else-if="isOpen && (minYear || maxYear)"
          @click.stop="resetYear"
          class="text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400">
          {{ t('home.clear') }}
        </button>
      </template>
      <div class="flex items-center gap-2">
        <div class="mx-1 flex-1">
          <label for="min-year" class="mb-1 block text-xs text-gray-500">Min</label>
          <select
            id="min-year"
            name="min-year"
            :value="minYear"
            @input="emit('update:minYear', ($event.target as HTMLSelectElement).value)"
            class="select h-10 w-full min-w-0 !px-2 text-sm">
            <option value="">{{ t('home.all') }}</option>
            <option v-for="year in minYearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        <span class="mt-5 text-gray-300">—</span>
        <div class="mx-1 flex-1">
          <label for="max-year" class="mb-1 block text-xs text-gray-500">Max</label>
          <select
            id="max-year"
            name="max-year"
            :value="maxYear"
            @input="emit('update:maxYear', ($event.target as HTMLSelectElement).value)"
            class="select h-10 w-full min-w-0 !px-2 text-sm">
            <option value="">{{ t('home.all') }}</option>
            <option v-for="year in maxYearOptions" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </BaseAccordion>

    <BaseAccordion :title="t('home.date')">
      <template #header-action="{ isOpen }">
        <span v-if="!isOpen" class="max-w-[140px] truncate text-sm font-normal text-gray-500">
          <template v-if="minDate || maxDate">
            {{ formatDateDisplay(minDate) || '...' }} - {{ formatDateDisplay(maxDate) || '...' }}
          </template>
        </span>
        <button
          v-else-if="minDate || maxDate"
          @click.stop="resetDate"
          class="text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400">
          {{ t('home.clear') }}
        </button>
      </template>
      <div class="flex flex-col gap-3 px-1">
        <div class="w-full">
          <label class="mb-1 block text-xs text-gray-500">Min</label>
          <VueDatePicker
            :model-value="minDate"
            @update:model-value="emit('update:minDate', $event ? $event : '')"
            model-type="yyyy-MM-dd"
            :enable-time-picker="false"
            auto-apply
            teleport="body"
            :locale="currentLocale"
            :select-text="t('home.apply')"
            :cancel-text="t('home.clear')"
            format="dd.MM.yyyy"
            :placeholder="t('home.date') + ' (Min)'"
            input-class-name="!h-10 !w-full !rounded-lg !border-gray-200 !bg-gray-50 !text-sm dark:!border-slate-700 dark:!bg-slate-900/50 dark:!text-gray-100" />
        </div>
        <div class="w-full">
          <label class="mb-1 block text-xs text-gray-500">Max</label>
          <VueDatePicker
            :model-value="maxDate"
            @update:model-value="emit('update:maxDate', $event ? $event : '')"
            model-type="yyyy-MM-dd"
            :enable-time-picker="false"
            auto-apply
            teleport="body"
            :locale="currentLocale"
            :select-text="t('home.apply')"
            :cancel-text="t('home.clear')"
            format="dd.MM.yyyy"
            :placeholder="t('home.date') + ' (Max)'"
            input-class-name="!h-10 !w-full !rounded-lg !border-gray-200 !bg-gray-50 !text-sm dark:!border-slate-700 dark:!bg-slate-900/50 dark:!text-gray-100" />
        </div>
      </div>
    </BaseAccordion>
  </div>
</template>
