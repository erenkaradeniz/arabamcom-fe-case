<script setup lang="ts">
  import BaseAccordion from '@/components/ui/BaseAccordion.vue'
  import { computed } from 'vue'
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

  const { t } = useI18n()

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
  <div class="space-y-2">
    <BaseAccordion title="Yıl">
      <template #header-action="{ isOpen }">
        <span v-if="!isOpen && (minYear || maxYear)" class="text-sm font-normal text-gray-500">
          {{ minYear || startYear }} - {{ maxYear || currentYear }}
        </span>
        <button
          v-else-if="isOpen && (minYear || maxYear)"
          @click.stop="resetYear"
          class="text-sm font-medium text-red-600 hover:text-red-700 hover:underline dark:text-red-400">
          Sıfırla
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
            <option value="">Tümü</option>
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
            <option value="">Tümü</option>
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
          Sıfırla
        </button>
      </template>
      <div class="flex items-center gap-1">
        <div class="min-w-0 flex-1">
          <label for="min-date" class="mb-1 block text-xs text-gray-500">Min</label>
          <input
            id="min-date"
            name="min-date"
            type="date"
            :value="minDate"
            @input="emit('update:minDate', ($event.target as HTMLInputElement).value)"
            class="input h-10 w-full !px-1.5 text-xs" />
        </div>
        <span class="mt-5 shrink-0 text-gray-300">—</span>
        <div class="min-w-0 flex-1">
          <label for="max-date" class="mb-1 block text-xs text-gray-500">Max</label>
          <input
            id="max-date"
            name="max-date"
            type="date"
            :value="maxDate"
            @input="emit('update:maxDate', ($event.target as HTMLInputElement).value)"
            class="input h-10 w-full !px-1.5 text-xs" />
        </div>
      </div>
    </BaseAccordion>
  </div>
</template>
