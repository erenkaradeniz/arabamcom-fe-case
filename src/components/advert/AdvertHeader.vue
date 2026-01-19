<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
  isLoading: boolean
  listingCount: number
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <h1 class="text-3xl md:text-4xl font-bold text-text-main dark:text-white tracking-tight">
      {{ t('home.title') }}
    </h1>
    <div class="mt-2 flex items-center gap-4 text-text-muted dark:text-gray-400">
      <p>
        <span v-if="isLoading && !listingCount">{{ t('home.loading_listings') }}</span>
        <span v-else>{{ t('home.listing_count', { count: listingCount }) }}</span>
      </p>
    </div>
  </div>
</template>
