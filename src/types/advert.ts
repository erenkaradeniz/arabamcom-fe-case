export interface AdvertQueryParams {
  sort?: number
  sortDirection?: number
  skip?: number
  take?: number
  categoryId?: number
  minYear?: number
  maxYear?: number
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
