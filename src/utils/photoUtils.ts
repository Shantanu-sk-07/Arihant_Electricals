export function photoUrlsToString(urls: string[]): string | null {
  const clean = urls.map((u) => u.trim()).filter(Boolean)
  return clean.length > 0 ? clean.join(',') : null
}

export function stringToPhotoUrls(value: string | null): string[] {
  if (!value) return []
  return value.split(',').map((u) => u.trim()).filter(Boolean)
}