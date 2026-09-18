export const INFORMATION_TYPES = {
  TAKEN: '२०२६ मध्ये मूर्ती घेतलेले मंडळ',
  UPCOMING: 'आगामी वर्षासाठी अपेक्षित मूर्ती',
} as const

export type InformationType =
  (typeof INFORMATION_TYPES)[keyof typeof INFORMATION_TYPES]

export interface MandalRecord {
  id: number
  created_at: string
  mandal_name: string
  president_name: string
  president_mobile: string
  idol_photo_url: string | null
  information_type: string
}

export interface MandalFormValues {
  mandal_name: string
  president_name: string
  president_mobile: string
  information_type: InformationType | ''
  newPhotos: File[]
  existingPhotos: string[]
  removedPhotos: string[]
}