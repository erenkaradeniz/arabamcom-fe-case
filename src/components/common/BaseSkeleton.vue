<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

interface Props {
  width?: string
  height?: string
  className?: string
  style?: CSSProperties
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  className: '',
})

const computedStyle = computed<CSSProperties>(() => ({
  width: props.width,
  height: props.height,
  ...props.style,
}))
</script>

<template>
  <div
    class="skeleton flex-shrink-0 rounded-xl"
    :class="className"
    :style="computedStyle"
  ></div>
</template>
