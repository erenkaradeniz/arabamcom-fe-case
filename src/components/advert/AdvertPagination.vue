<script setup lang="ts">
  import { PaginationMode } from '@/types'
  import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-vue-next'
  import { onMounted, onUnmounted, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    mode: PaginationMode
    isFetchingNextPage: boolean
    hasMore: boolean
    currentPage: number
    totalCount: number
    take: number
  }>()

  const emit = defineEmits<{
    (e: 'next-page'): void
    (e: 'prev-page'): void
    (e: 'load-more'): void
  }>()

  const { t } = useI18n()
  const loadMoreTrigger = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  const setupObserver = () => {
    if (props.mode !== PaginationMode.Scroll) return
    if (observer) observer.disconnect()

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !props.isFetchingNextPage && props.hasMore) {
          emit('load-more')
        }
      },
      { rootMargin: '200px' }
    )

    if (loadMoreTrigger.value) observer.observe(loadMoreTrigger.value)
  }

  watch(loadMoreTrigger, (el) => {
    if (el && props.mode === PaginationMode.Scroll) setupObserver()
  })

  watch(
    () => props.mode,
    () => {
      if (props.mode === PaginationMode.Scroll) {
        setTimeout(setupObserver, 100)
      } else {
        if (observer) observer.disconnect()
      }
    }
  )

  watch(
    () => props.hasMore,
    (hasMore) => {
      if (hasMore && props.mode === PaginationMode.Scroll) {
        setTimeout(setupObserver, 100)
      }
    }
  )

  onMounted(() => {
    setupObserver()
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })
</script>

<template>
  <div>
    <div
      v-if="mode === PaginationMode.Scroll"
      ref="loadMoreTrigger"
      class="flex h-20 w-full items-center justify-center py-8">
      <div v-if="isFetchingNextPage" class="text-primary flex items-center gap-2">
        <Loader2 :size="24" class="animate-spin" />
        <span class="text-sm font-medium">{{ t('common.loading') }}</span>
      </div>
    </div>

    <div
      v-else
      class="flex items-center justify-center gap-4 border-t border-gray-100 py-8 dark:border-gray-800">
      <button
        v-if="currentPage > 1"
        @click="emit('prev-page')"
        class="text-text-main flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
        <ChevronLeft :size="20" />
        {{ t('common.prev') }}
      </button>
      <div v-else class="w-[100px]"></div>

      <span class="text-primary text-lg font-bold">{{ currentPage }}</span>

      <button
        v-if="totalCount >= take"
        @click="emit('next-page')"
        class="text-text-main flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-colors hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
        {{ t('common.next') }}
        <ChevronRight :size="20" />
      </button>
      <div v-else class="w-[100px]"></div>
    </div>
  </div>
</template>
