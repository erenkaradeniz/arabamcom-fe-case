export interface AdvertQueryParams {
  sort?: number
  sortDirection?: number
  skip?: number
  take?: number
  categoryId?: number
  minYear?: number
  maxYear?: number
  minDate?: string
  maxDate?: string
}

export interface BaseAdvert {
  id: number
  title: string
  location: Location
  category: Category
  modelName: string
  price: number
  priceFormatted: string
  date: string
  dateFormatted: string
  properties: Property[]
}

export interface AdvertDetail extends BaseAdvert {
  photos: string[]
  text: string
  userInfo: UserInfo
}

export type AdvertListItem = Omit<AdvertDetail, 'photos' | 'text' | 'userInfo'> & {
  photo: string
}

export interface Property {
  name: string
  value: string
}

export interface Category {
  id: number
  name: string
}

export interface Location {
  cityName: string
  townName: string
}

export interface UserInfo {
  id: number
  nameSurname: string
  phone: string
  phoneFormatted: string
}

export enum SortType {
  Price = 0,
  Date = 1,
  Year = 2,
}

export enum SortDirection {
  Ascending = 0,
  Descending = 1,
}

export const PhotoSizes = {
  Thumbnail: '120x90',
  Small: '160x120',
  Medium: '240x180',
  Large: '580x435',
  ExtraLarge: '800x600',
  Full: '1920x1080',
} as const

export type PhotoSizeType = (typeof PhotoSizes)[keyof typeof PhotoSizes]
