import { useGlobalError } from '@/composables/useGlobalError'
import i18n from '@/i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'
import '@vuepic/vue-datepicker/dist/main.css'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const { setError } = useGlobalError()

app.config.errorHandler = (err, instance, info) => {
  console.error('[Global Error Handler]:', err)
  console.error('[Vue Instance]:', instance)
  console.error('[Error Info]:', info)
  setError(err)
}

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  },
})

app.mount('#app')
