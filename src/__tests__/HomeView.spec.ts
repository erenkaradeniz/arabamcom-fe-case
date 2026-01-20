import HomeView from '@/views/HomeView.vue'
import { createTestingPinia } from '@pinia/testing'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { ref } from 'vue'
import { createI18n } from 'vue-i18n'
import router from '../router'

vi.mock('vue-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('vue-router')>()
  return {
    ...actual,
    onBeforeRouteLeave: vi.fn(),
  }
})

vi.mock('@/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/composables')>()
  return {
    ...actual,
    useResponsiveLayout: vi.fn(() => ({
      activeViewMode: ref('grid'),
      activePaginationMode: ref('pagination'),
    })),
    useAdvertListInfinite: vi.fn(() => ({
      data: ref({ pages: [] }),
      isLoading: ref(false),
      isError: ref(false),
      error: ref(null),
      fetchNextPage: vi.fn(),
      hasNextPage: ref(false),
      isFetchingNextPage: ref(false),
    })),
    useAdvertListPaged: vi.fn(() => ({
      data: ref([]),
      isLoading: ref(false),
      isError: ref(false),
      error: ref(null),
    })),
  }
})

const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn(),
}))
vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

describe('HomeView', () => {
  it('renders empty state when no adverts found', async () => {
    await router.push('/')
    await router.isReady()

    const i18n = createI18n({
      legacy: false,
      locale: 'tr',
      messages: {
        tr: {
          home: {
            no_results_found: 'İlan bulunamadı',
            try_changing_filters: 'Filtreleri değiştirmeyi deneyin',
            listing_count: '{count} ilan',
            filter: 'Filtrele',
            apply: 'Uygula',
            clear_filters: 'Filtreleri Temizle',
          },
          common: {
            error: 'Hata',
          },
        },
      },
    })

    const wrapper = mount(HomeView, {
      global: {
        plugins: [
          router,
          i18n,
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              filter: { filters: {} },
              ui: { viewMode: 'grid' },
            },
          }),
        ],
        stubs: {
          AdvertControls: true,
          AdvertFilter: true,
          AdvertFilterForm: true,
          AdvertCard: true,
          AdvertListCard: true,
          AdvertListHeader: true,
          AdvertTableCard: true,
          BaseSkeleton: true,
        },
      },
    })

    expect(wrapper.text()).toContain('İlan bulunamadı')
  })
})
