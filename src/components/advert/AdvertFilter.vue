<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
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
    },
  ): void
  (e: 'reset'): void
}>()

const { t } = useI18n()

const minYear = ref<string | number>('')
const maxYear = ref<string | number>('')
const minDate = ref<string>('')
const maxDate = ref<string>('')

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      minYear.value = props.initialMinYear || ''
      maxYear.value = props.initialMaxYear || ''
      minDate.value = props.initialMinDate || ''
      maxDate.value = props.initialMaxDate || ''
    }
  },
)

const minYearOptions = computed(() => {
  const max = maxYear.value ? Number(maxYear.value) : Infinity
  return yearOptions.filter((year) => year <= max)
})

const maxYearOptions = computed(() => {
  const min = minYear.value ? Number(minYear.value) : -Infinity
  return yearOptions.filter((year) => year >= min)
})

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
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="emit('close')"></div>

    <div class="relative bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-text-main dark:text-white">{{ t('home.filter') }}</h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer"
        >
          <X :size="24" />
        </button>
      </div>

      <div class="space-y-4">
        <label class="block">
          <span class="text-sm font-medium text-text-main dark:text-white mb-2 block">{{
            t('home.model_year')
          }}</span>
          <div class="flex items-center gap-3">
            <select
              v-model="minYear"
              class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="">{{ t('home.year_min') }}</option>
              <option v-for="year in minYearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <span class="text-gray-400">—</span>
            <select
              v-model="maxYear"
              class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="">{{ t('home.year_max') }}</option>
              <option v-for="year in maxYearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </label>

        <label class="block">
          <span class="text-sm font-medium text-text-main dark:text-white mb-2 block">{{
            t('home.date')
          }}</span>
          <div class="flex items-center gap-3">
            <input
              type="date"
              v-model="minDate"
              class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-full"
              placeholder="Min Date"
            />
            <span class="text-gray-400">—</span>
            <input
              type="date"
              v-model="maxDate"
              class="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer w-full"
              placeholder="Max Date"
            />
          </div>
        </label>
      </div>

      <div class="flex gap-3 mt-8">
        <button
          @click="handleReset"
          class="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
        >
          {{ t('home.clear') }}
        </button>
        <button
          @click="handleApply"
          class="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition cursor-pointer"
        >
          {{ t('home.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>
