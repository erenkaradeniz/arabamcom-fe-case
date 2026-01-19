export const formatKm = (km: string | number | undefined): string | null => {
  if (!km) return null
  return `${Number(km).toLocaleString('tr-TR')} km`
}
