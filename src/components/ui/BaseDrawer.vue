<script setup lang="ts">
  import { X } from 'lucide-vue-next'

  defineProps<{
    isOpen: boolean
    title?: string
  }>()

  const emit = defineEmits<{
    (e: 'close'): void
  }>()
</script>

<template>
  <div
    class="relative z-50 transition-all"
    aria-labelledby="slide-over-title"
    role="dialog"
    aria-modal="true">
    <transition
      enter-active-class="ease-in-out duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in-out duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity"
        @click="emit('close')"></div>
    </transition>

    <div v-if="isOpen" class="pointer-events-none fixed inset-0 overflow-hidden">
      <div class="absolute inset-0 overflow-hidden">
        <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <transition
            appear
            enter-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from-class="translate-x-full"
            enter-to-class="translate-x-0"
            leave-active-class="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from-class="translate-x-0"
            leave-to-class="translate-x-full">
            <div class="pointer-events-auto w-screen max-w-md">
              <div class="flex h-full flex-col bg-white shadow-xl dark:bg-slate-900">
                <div
                  class="flex-shrink-0 border-b border-gray-100 px-4 py-4 sm:px-6 dark:border-gray-800">
                  <div class="flex items-center justify-between">
                    <h2
                      v-if="title"
                      class="text-lg leading-6 font-semibold text-gray-900 dark:text-white">
                      {{ title }}
                    </h2>
                    <slot name="header-action"></slot>
                    <button
                      type="button"
                      class="relative ml-auto rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-slate-900 dark:text-gray-300 dark:hover:text-white"
                      @click="emit('close')">
                      <span class="absolute -inset-2.5"></span>
                      <span class="sr-only">Close panel</span>
                      <X :size="24" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div class="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <slot></slot>
                </div>
                <div
                  v-if="$slots.footer"
                  class="flex-shrink-0 border-t border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
                  <slot name="footer"></slot>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>
