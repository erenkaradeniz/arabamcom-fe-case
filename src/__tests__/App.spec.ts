import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createI18n } from 'vue-i18n'
import App from '../App.vue'
import router from '../router'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

describe('App', () => {
  it('mounts properly', () => {
    const i18n = createI18n({
      legacy: false,
      locale: 'tr',
      messages: {
        tr: {
          nav: { switch_language: 'Lang', dark_mode: 'Dark', light_mode: 'Light' },
          meta: { title: 'Test Title' },
        },
      },
    })

    const wrapper = mount(App, {
      global: {
        plugins: [i18n, router, createTestingPinia({ createSpy: vi.fn })],
        stubs: {
          RouterView: true,
        },
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('header').exists()).toBe(true)
  })
})
