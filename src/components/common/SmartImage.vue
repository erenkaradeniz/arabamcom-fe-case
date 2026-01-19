<script setup lang="ts">
import { PhotoSizes, type PhotoSizeType } from '@/types'
import { getAdvertImage } from '@/utils/image'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

import type { CSSProperties } from 'vue'

interface Props {
  src: string | null | undefined
  alt?: string
  preferredSize?: PhotoSizeType
  lazy?: boolean
  showSkeleton?: boolean
  aspectRatio?: string
  imageClass?: string
  imageStyle?: CSSProperties
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  transparent?: boolean
}

interface ImageLoadedEvent {
  size: PhotoSizeType
  fallbackCount: number
  url: string
}

interface ImageFallbackEvent {
  from: PhotoSizeType
  to: PhotoSizeType
  attempt: number
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  preferredSize: PhotoSizes.Full,
  lazy: true,
  showSkeleton: true,
  aspectRatio: '4/3',
  imageClass: '',
  imageStyle: () => ({}),
  objectFit: 'cover',
  transparent: false,
})

const emit = defineEmits<{
  (e: 'loaded', payload: ImageLoadedEvent): void
  (e: 'fallback', payload: ImageFallbackEvent): void
  (e: 'error'): void
}>()

const FALLBACK_ORDER: PhotoSizeType[] = [
  PhotoSizes.Full,
  PhotoSizes.ExtraLarge,
  PhotoSizes.Large,
  PhotoSizes.Medium,
  PhotoSizes.Small,
  PhotoSizes.Thumbnail,
]

const containerRef = ref<HTMLElement | null>(null)
const isInView = ref(!props.lazy)
const isLoading = ref(true)
const hasError = ref(false)
const fallbackCount = ref(0)

const startIndex = computed(() => {
  const idx = FALLBACK_ORDER.indexOf(props.preferredSize)
  return idx >= 0 ? idx : 0
})

const currentSizeIndex = ref(startIndex.value)
const currentSize = computed(() => FALLBACK_ORDER[currentSizeIndex.value] || PhotoSizes.Large)
const imageSrc = computed(() =>
  isInView.value ? getAdvertImage(props.src, currentSize.value) : '',
)

const handleLoad = () => {
  isLoading.value = false
  hasError.value = false

  if (import.meta.env.DEV && fallbackCount.value > 0) {
    console.debug(
      `[SmartImage] Loaded after ${fallbackCount.value} fallback(s): ${currentSize.value}`,
    )
  }

  emit('loaded', {
    size: currentSize.value,
    fallbackCount: fallbackCount.value,
    url: imageSrc.value,
  })
}

const handleError = () => {
  const prevSize = currentSize.value

  if (currentSizeIndex.value < FALLBACK_ORDER.length - 1) {
    currentSizeIndex.value++
    fallbackCount.value++

    if (import.meta.env.DEV) {
      console.debug(`[SmartImage] Fallback: ${prevSize} → ${currentSize.value}`)
    }

    emit('fallback', {
      from: prevSize,
      to: currentSize.value,
      attempt: fallbackCount.value,
    })
  } else {
    isLoading.value = false
    hasError.value = true
    emit('error')

    if (import.meta.env.DEV) {
      console.warn(`[SmartImage] All sizes failed for: ${props.src}`)
    }
  }
}

const reset = () => {
  currentSizeIndex.value = startIndex.value
  isLoading.value = true
  hasError.value = false
  fallbackCount.value = 0
}

watch(() => props.src, reset)
watch(() => props.preferredSize, reset)

let observer: IntersectionObserver | null = null

onMounted(() => {
  if (!props.lazy || !containerRef.value) {
    isInView.value = true
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        isInView.value = true
        observer?.disconnect()
      }
    },
    { rootMargin: '100px' },
  )

  observer.observe(containerRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="containerRef"
    class="smart-image-container"
    :class="{ 'bg-gray-100 dark:bg-gray-800': !transparent }"
    :style="{ aspectRatio }"
  >
    <div v-if="isLoading && showSkeleton && isInView" class="smart-image-skeleton">
      <slot name="loading">
        <div class="smart-image-skeleton-inner"></div>
      </slot>
    </div>

    <div v-if="hasError" class="smart-image-error">
      <slot name="error">
        <div class="smart-image-error-inner">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        </div>
      </slot>
    </div>

    <img
      v-if="imageSrc && !hasError"
      :src="imageSrc"
      :alt="alt"
      class="smart-image"
      :class="[{ 'smart-image-loaded': !isLoading }, imageClass]"
      :style="[{ objectFit }, imageStyle]"
      @load="handleLoad"
      @error="handleError"
    />
  </div>
</template>

<style scoped>
.smart-image-container {
  position: relative;
  overflow: hidden;
}

.smart-image {
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.smart-image-loaded {
  opacity: 1;
}

.smart-image-skeleton {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smart-image-skeleton-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.dark .smart-image-skeleton-inner {
  background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
  background-size: 200% 100%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.smart-image-error {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smart-image-error-inner {
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.dark .smart-image-error-inner {
  color: #6b7280;
}
</style>
