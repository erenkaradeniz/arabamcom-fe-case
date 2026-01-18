<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import { Car, Sun, Moon, Languages } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t, locale } = useI18n()

const isDark = useDark()
const toggleDark = useToggle(isDark)

const toggleLanguage = () => {
  locale.value = locale.value === 'tr' ? 'en' : 'tr'
}

const headerActions = computed(() => [
  {
    icon: Languages,
    label: locale.value.toUpperCase(),
    title: t('nav.switch_language'),
    action: toggleLanguage,
  },
  {
    icon: isDark.value ? Sun : Moon,
    title: isDark.value ? t('nav.light_mode') : t('nav.dark_mode'),
    action: () => toggleDark(),
  },
])
</script>

<template>
  <div
    class="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300"
  >
    <header
      class="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <RouterLink
            to="/"
            class="flex items-center gap-2 text-2xl font-extrabold text-primary hover:opacity-80 transition-opacity duration-200"
          >
            <Car :size="32" stroke-width="2" />
            arabam<span class="text-text-main dark:text-white">.com</span>
          </RouterLink>

          <div class="flex items-center gap-2">
            <button
              v-for="action in headerActions"
              :key="action.title"
              @click="action.action"
              class="p-2.5 rounded-lg text-text-muted hover:text-text-main hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center gap-1 font-bold text-xs cursor-pointer"
              :title="action.title"
            >
              <component :is="action.icon" :size="20" />
              <span v-if="action.label">{{ action.label }}</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>

    <footer class="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"></div>
    </footer>
  </div>
</template>
