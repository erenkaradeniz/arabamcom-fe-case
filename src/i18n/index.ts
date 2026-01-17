import { createI18n } from 'vue-i18n'
import messages from './locales'

export default createI18n({
  legacy: false,
  locale: 'tr',
  fallbackLocale: 'en',
  messages,
})
