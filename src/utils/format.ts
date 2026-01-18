export const formatPrice = (price: number): string => {
  const formatted = new Intl.NumberFormat('tr-TR').format(price)
  return `${formatted} TL`
}

export const formatKm = (km: string | number | undefined): string | null => {
  if (!km) return null
  return `${Number(km).toLocaleString('tr-TR')} km`
}
