import { useAdvertDisplay } from '@/composables/useAdvertDisplay'
import type { AdvertListItem } from '@/types'
import { describe, expect, it } from 'vitest'

describe('useAdvertDisplay', () => {
  const mockAdvert: AdvertListItem = {
    id: 1,
    title: 'Test Car',
    price: 100000,
    priceFormatted: '100.000 TL',
    date: '2023-01-01',
    dateFormatted: '01.01.2023',
    category: { id: 1, name: 'Sedan' },
    modelName: 'Civic',
    properties: [
      { name: 'year', value: '2020' },
      { name: 'km', value: '50000' },
      { name: 'color', value: 'Red' },
    ],
    photo: 'photo1.jpg',
    location: { cityName: 'Istanbul', townName: 'Besiktas' },
  }

  it('getProperty returns correct value', () => {
    const { getProperty } = useAdvertDisplay(mockAdvert)
    expect(getProperty('year')).toBe('2020')
    expect(getProperty('km')).toBe('50000')
  })

  it('advertProperties returns formatted items', () => {
    const { advertProperties } = useAdvertDisplay(mockAdvert)
    const props = advertProperties.value

    expect(props).toHaveLength(3)

    expect(props?.[0]?.value).toBe('2020')
    expect(props?.[1]?.value).toContain('50')
  })
})
