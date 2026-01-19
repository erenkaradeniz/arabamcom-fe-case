<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  defineProps<{
    isLoading: boolean
    listingCount: number
  }>()

  const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-text-main text-3xl font-bold tracking-tight md:text-4xl dark:text-white">
      {{ t('home.title') }}
    </h1>
    <div class="text-text-muted mt-2 flex items-center gap-4 dark:text-gray-400">
      <p>
        <span v-if="isLoading && !listingCount">{{ t('home.loading_listings') }}</span>
        <span v-else>{{ t('home.listing_count', { count: listingCount }) }}</span>
      </p>
    </div>
  </div>
</template>
