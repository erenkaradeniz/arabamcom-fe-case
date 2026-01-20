import AdvertControls from '@/components/advert/AdvertControls.vue'
import { PaginationMode, ViewMode } from '@/types'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { createI18n } from 'vue-i18n'

describe('AdvertControls', () => {
  const defaultProps = {
    take: 20,
    sortKey: 'price_asc',
    viewMode: ViewMode.Grid,
    paginationMode: PaginationMode.Pagination,
    hasActiveFilters: false,
  }

  const i18n = createI18n({
    legacy: false,
    locale: 'tr',
    messages: {
      tr: {
        sort: {
          price_asc: 'Price Asc',
          price_desc: 'Price Desc',
          model_year_desc: 'Year Desc',
          model_year_asc: 'Year Asc',
          advert_date_desc: 'Date Desc',
          advert_date_asc: 'Date Asc',
        },
        common: {
          adverts: 'listings',
        },
      },
    },
  })

  it('renders properly', () => {
    const wrapper = mount(AdvertControls, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('emits update:take event when pagination select changes', async () => {
    const wrapper = mount(AdvertControls, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const select = wrapper.find('select[name="pagination-select"]')
    await select.setValue(`50-${PaginationMode.Pagination}`)

    expect(wrapper.emitted('update:take')).toBeTruthy()
    expect(wrapper.emitted('update:take')?.[0]).toEqual([50])
  })

  it('emits update:viewMode when toggling view buttons', async () => {
    const wrapper = mount(AdvertControls, {
      props: defaultProps,
      global: {
        plugins: [i18n],
      },
    })

    const buttons = wrapper.findAll('.toggle-group button')
    const listButton = buttons[1]

    expect(listButton).toBeDefined()
    if (listButton) {
      await listButton.trigger('click')
    }

    expect(wrapper.emitted('update:viewMode')).toBeTruthy()
    expect(wrapper.emitted('update:viewMode')?.[0]).toEqual([ViewMode.List])
  })
})
