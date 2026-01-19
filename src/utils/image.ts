import { PhotoSizes, type PhotoSizeType } from '@/types'

export const getAdvertImage = (
  photoUrl: string | null | undefined,
  size: PhotoSizeType = PhotoSizes.Large
): string => {
  if (!photoUrl) {
    return ''
  }
  return photoUrl.replace('{0}', size)
}
