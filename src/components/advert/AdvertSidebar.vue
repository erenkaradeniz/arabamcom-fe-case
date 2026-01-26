<script setup lang="ts">
  import AdvertFilterForm from '@/components/advert/AdvertFilterForm.vue'
  import { useFilterStore } from '@/stores'
  import { useElementBounding } from '@vueuse/core'
  import { storeToRefs } from 'pinia'
  import { computed, reactive, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const filterStore = useFilterStore()
  const { filters, hasActiveFilters } = storeToRefs(filterStore)

  const sidebarRef = ref<HTMLElement | null>(null)
  const { top: sidebarTop } = useElementBounding(sidebarRef)

  const isMerged = computed(() => sidebarTop.value <= 145)

  const sidebarFilters = reactive({
    minYear: filters.value.minYear,
    maxYear: filters.value.maxYear,
    minDate: filters.value.minDate,
    maxDate: filters.value.maxDate,
  })

  watch(
    filters,
    (newVal) => {
      sidebarFilters.minYear = newVal.minYear
      sidebarFilters.maxYear = newVal.maxYear
      sidebarFilters.minDate = newVal.minDate
      sidebarFilters.maxDate = newVal.maxDate
    },
    { deep: true }
  )

  const hasSidebarChanges = computed(() => {
    const f = filters.value
    const s = sidebarFilters

    const normalize = (val: unknown) => {
      if (val === '' || val === null || val === undefined) return undefined
      return String(val)
    }

    return (
      normalize(f.minYear) !== normalize(s.minYear) ||
      normalize(f.maxYear) !== normalize(s.maxYear) ||
      normalize(f.minDate) !== normalize(s.minDate) ||
      normalize(f.maxDate) !== normalize(s.maxDate)
    )
  })

  const emit = defineEmits<{
    (e: 'apply', filters: typeof sidebarFilters): void
    (e: 'reset'): void
  }>()

  const handleApply = () => {
    emit('apply', sidebarFilters)
  }

  const handleReset = () => {
    emit('reset')
  }
</script>

<template>
  <aside class="hidden w-80 shrink-0 lg:block">
    <div
      ref="sidebarRef"
      :class="[
        'shadow-soft sticky top-36 rounded-2xl border border-gray-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900',
        'transition-all duration-300',
        { 'rounded-t-none! border-t-transparent!': isMerged },
      ]">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ t('home.filter') }}</h2>
        <button
          v-if="hasActiveFilters"
          @click="handleReset"
          class="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">
          {{ t('home.clear') }}
        </button>
      </div>

      <AdvertFilterForm
        v-model:min-year="sidebarFilters.minYear"
        v-model:max-year="sidebarFilters.maxYear"
        v-model:min-date="sidebarFilters.minDate"
        v-model:max-date="sidebarFilters.maxDate"
        class="mb-6" />

      <Transition
        enter-active-class="transition-all duration-300 ease-out overflow-hidden"
        enter-from-class="opacity-0 -translate-y-2 max-h-0"
        enter-to-class="opacity-100 translate-y-0 max-h-20"
        leave-active-class="transition-all duration-300 ease-in overflow-hidden"
        leave-from-class="opacity-100 translate-y-0 max-h-20"
        leave-to-class="opacity-0 -translate-y-2 max-h-0">
        <div v-if="hasSidebarChanges" class="pb-2">
          <button @click="handleApply" class="btn-primary w-full">
            {{ t('home.apply') }}
          </button>
        </div>
      </Transition>
    </div>
  </aside>
</template>
