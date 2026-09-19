export function photoUrlsToString(urls: string[]): string | null {
  const clean = urls.map((u) => u.trim()).filter(Boolean)
  return clean.length > 0 ? clean.join(',') : null
}

export function stringToPhotoUrls(value: string | null): string[] {
  if (!value) return []
  return value.split(',').map((u) => u.trim()).filter(Boolean)
}

export function generateShortId(): string {
  const time = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 8)
  return `${time}-${rand}`
}