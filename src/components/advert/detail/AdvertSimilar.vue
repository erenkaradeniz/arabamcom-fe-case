<script setup lang="ts">
  import AdvertCard from '@/components/advert/AdvertCard.vue'
  import BaseSkeleton from '@/components/ui/BaseSkeleton.vue'
  import { useSimilarAdverts } from '@/composables'
  import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
  import { computed, ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const props = defineProps<{
    categoryId: number
    currentAdvertId: number
  }>()

  const emit = defineEmits<{
    (e: 'loaded', count: number): void
  }>()

  const { t } = useI18n()

  const { data: similarAdverts, isLoading } = useSimilarAdverts(
    computed(() => props.categoryId),
    computed(() => props.currentAdvertId)
  )

  watch(
    similarAdverts,
    (newAdverts) => {
      if (newAdverts) {
        emit('loaded', newAdverts.length)
      }
    },
    { immediate: true }
  )

  const scrollRef = ref<HTMLElement | null>(null)

  const scrollLeft = () => {
    scrollRef.value?.scrollBy({ left: -320, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.value?.scrollBy({ left: 320, behavior: 'smooth' })
  }
</script>

<template>
  <div v-if="isLoading || (similarAdverts?.length ?? 0) > 0" class="mt-8 lg:mt-12">
    <h3 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
      {{ t('detail.similar_adverts') }}
    </h3>

    <div v-if="isLoading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <BaseSkeleton v-for="n in 4" :key="n" height="20rem" />
    </div>

    <div v-else class="relative">
      <button
        @click="scrollLeft"
        class="absolute top-1/2 -left-4 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-50 md:flex dark:bg-slate-800 dark:hover:bg-slate-700">
        <ChevronLeft :size="24" class="text-gray-600 dark:text-gray-300" />
      </button>

      <div
        ref="scrollRef"
        class="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:px-0">
        <div
          v-for="similar in similarAdverts"
          :key="similar.id"
          class="max-w-[280px] min-w-[280px] sm:max-w-[300px] sm:min-w-[300px]">
          <AdvertCard
            :advert="similar"
            :index="0"
            @click="$router.push({ name: 'advert-detail', params: { id: similar.id } })" />
        </div>
      </div>

      <button
        @click="scrollRight"
        class="absolute top-1/2 -right-4 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-all hover:bg-gray-50 disabled:opacity-50 md:flex dark:bg-slate-800 dark:hover:bg-slate-700">
        <ChevronRight :size="24" class="text-gray-600 dark:text-gray-300" />
      </button>
    </div>
  </div>
</template>
