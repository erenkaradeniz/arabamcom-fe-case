<script setup lang="ts">
  import { useGlobalError } from '@/composables/useGlobalError'
  import { AlertTriangle, Home, RefreshCw } from 'lucide-vue-next'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { error, clearError } = useGlobalError()

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    clearError()
    window.location.href = '/'
  }
</script>

<template>
  <div
    class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-50 p-4 dark:bg-slate-900">
    <div class="w-full max-w-md text-center">
      <div class="mb-6 flex justify-center">
        <div class="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
          <AlertTriangle :size="48" class="text-red-600 dark:text-red-500" />
        </div>
      </div>

      <h1 class="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {{ t('global_error.title') }}
      </h1>
      <p class="mb-8 text-gray-600 dark:text-gray-400">
        {{ t('global_error.message') }}
      </p>

      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button @click="handleReload" class="btn-primary">
          <RefreshCw :size="20" />
          {{ t('global_error.reload') }}
        </button>
        <button @click="handleGoHome" class="btn-secondary">
          <Home :size="20" />
          {{ t('global_error.home') }}
        </button>
      </div>

      <div
        v-if="error"
        class="mt-8 overflow-hidden rounded-lg bg-gray-100 text-left dark:bg-slate-800">
        <details class="group">
          <summary
            class="cursor-pointer p-4 font-mono text-xs font-bold text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-slate-700">
            {{ t('global_error.details') }}
          </summary>
          <div class="border-t border-gray-200 p-4 dark:border-slate-700">
            <pre class="font-mono text-xs whitespace-pre-wrap text-red-600 dark:text-red-400">{{
              error
            }}</pre>
          </div>
        </details>
      </div>
    </div>
  </div>
</template>
