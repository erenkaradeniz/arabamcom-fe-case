<script setup lang="ts">
  import GlobalError from '@/components/common/GlobalError.vue'
  import { useGlobalError } from '@/composables/useGlobalError'
  import { useDark, useToggle } from '@vueuse/core'
  import { Car, Languages, Moon, Sun } from 'lucide-vue-next'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { RouterLink, RouterView } from 'vue-router'

  const { error } = useGlobalError()

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
    class="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
    <GlobalError v-if="error" />
    <div v-else>
      <header class="header">
        <div class="container-main">
          <div class="flex h-16 items-center justify-between">
            <RouterLink
              to="/"
              class="text-primary flex items-center gap-2 text-2xl font-extrabold transition-opacity duration-200 hover:opacity-80">
              <Car :size="32" stroke-width="2" />
              arabam<span class="text-text-main dark:text-white">.com</span>
            </RouterLink>

            <div class="flex items-center gap-2">
              <button
                v-for="action in headerActions"
                :key="action.title"
                @click="action.action"
                class="btn-icon text-text-muted hover:text-text-main flex items-center gap-1 text-xs font-bold"
                :title="action.title">
                <component :is="action.icon" :size="20" />
                <span v-if="action.label">{{ action.label }}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="container-main py-8">
        <RouterView v-slot="{ Component }">
          <KeepAlive include="HomeView">
            <component :is="Component" />
          </KeepAlive>
        </RouterView>
      </main>

      <footer class="footer">
        <div class="container-main py-6"></div>
      </footer>
    </div>
  </div>
</template>
