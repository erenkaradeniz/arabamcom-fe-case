<script setup lang="ts">
import { ListVideo, ListOrdered } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps<{
  isLoading: boolean
  listingCount: number
  paginationMode: 'scroll' | 'pagination'
}>()

defineEmits<{
  (e: 'toggleMode'): void
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

      <button
        @click="$emit('toggleMode')"
        class="hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
        :title="
          paginationMode === 'scroll'
            ? 'Sayfalamaya Geç (Pagination)'
            : 'Sonsuz Kaydırmaya Geç (Infinite Scroll)'
        "
      >
        <ListVideo v-if="paginationMode === 'scroll'" :size="14" />
        <ListOrdered v-else :size="14" />
        <span>{{ paginationMode === 'scroll' ? 'Infinite Scroll' : 'Pagination' }}</span>
      </button>
    </div>
  </div>
</template>
