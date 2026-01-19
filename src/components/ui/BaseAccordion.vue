<script setup lang="ts">
  import { ChevronDown } from 'lucide-vue-next'
  import { ref } from 'vue'

  const props = withDefaults(
    defineProps<{
      title: string
      defaultOpen?: boolean
    }>(),
    {
      defaultOpen: false,
    }
  )

  const isOpen = ref(props.defaultOpen)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const onEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0'
    void element.offsetHeight
    element.style.height = element.scrollHeight + 'px'
  }

  const onAfterEnter = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = 'auto'
  }

  const onBeforeLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = element.scrollHeight + 'px'
    void element.offsetHeight
  }

  const onLeave = (el: Element) => {
    const element = el as HTMLElement
    element.style.height = '0'
  }
</script>

<template>
  <div class="cursor-pointer border-b border-gray-100 dark:border-gray-800">
    <div
      @click="toggle"
      class="flex w-full cursor-pointer items-center justify-between py-4 text-left font-medium text-gray-900 transition-colors hover:text-red-600 dark:text-gray-100 dark:hover:text-red-400">
      <span>{{ title }}</span>
      <div class="flex items-center gap-3">
        <div>
          <slot name="header-action" :is-open="isOpen"></slot>
        </div>
        <ChevronDown
          :size="20"
          class="text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }" />
      </div>
    </div>
    <Transition
      name="accordion"
      @enter="onEnter"
      @after-enter="onAfterEnter"
      @before-leave="onBeforeLeave"
      @leave="onLeave">
      <div v-show="isOpen" class="overflow-hidden">
        <div class="pb-4">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .accordion-enter-active,
  .accordion-leave-active {
    transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;
  }

  .accordion-enter-from,
  .accordion-leave-to {
    height: 0;
  }
</style>
