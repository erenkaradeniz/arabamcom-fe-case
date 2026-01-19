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
      }
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
    }
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
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-backdrop" @click="emit('close')"></div>

    <div class="modal-content">
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-heading text-xl">{{ t('home.filter') }}</h2>
        <button @click="emit('close')" class="btn-icon">
          <X :size="24" />
        </button>
      </div>

      <div class="space-y-4">
        <label class="block">
          <span class="text-heading mb-2 block text-sm">{{ t('home.model_year') }}</span>
          <div class="flex items-center gap-3">
            <select v-model="minYear" class="select flex-1">
              <option value="">{{ t('home.year_min') }}</option>
              <option v-for="year in minYearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <span class="text-gray-400">—</span>
            <select v-model="maxYear" class="select flex-1">
              <option value="">{{ t('home.year_max') }}</option>
              <option v-for="year in maxYearOptions" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
          </div>
        </label>

        <label class="block">
          <span class="text-heading mb-2 block text-sm">{{ t('home.date') }}</span>
          <div class="flex items-center gap-3">
            <input type="date" v-model="minDate" class="input flex-1" placeholder="Min Date" />
            <span class="text-gray-400">—</span>
            <input type="date" v-model="maxDate" class="input flex-1" placeholder="Max Date" />
          </div>
        </label>
      </div>

      <div class="mt-8 flex gap-3">
        <button @click="handleReset" class="btn-secondary flex-1">
          {{ t('home.clear') }}
        </button>
        <button @click="handleApply" class="btn-primary flex-1">
          {{ t('home.apply') }}
        </button>
      </div>
    </div>
  </div>
</template>
