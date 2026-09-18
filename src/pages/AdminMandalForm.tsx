/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material'
import { FormProvider, useForm } from 'react-hook-form'
import { BUCKET_NAME, supabase } from '../supabase'
import { INFORMATION_TYPES, type InformationType } from '../types'
import { photoUrlsToString } from '../utils/photoUtils'
import { compressMultipleImages } from '../utils/imageCompressor'
import { showSnackbar } from '../components/ToastMessage'
import PhotoUpload from '../components/PhotoUpload'

export type AdminMandalFormMode = 'add' | 'edit'

export interface AdminMandalFormResult {
  mandal_name: string
  president_name: string
  president_mobile: string
  information_type: InformationType
  newPhotos: File[]
  existingPhotos: string[]
  removedPhotos: string[]
}

interface AdminMandalFormProps {
  open: boolean
  mode: AdminMandalFormMode
  initialValues?: Partial<AdminMandalFormResult>
  onClose: () => void
  onSaved?: () => void
  recordId?: number
}

interface FormErrors {
  mandal_name?: string
  president_name?: string
  president_mobile?: string
  information_type?: string
  photos?: string
}

type PhotoItem = File | string

const emptyState: AdminMandalFormResult = {
  mandal_name: '',
  president_name: '',
  president_mobile: '',
  information_type: INFORMATION_TYPES.TAKEN,
  newPhotos: [],
  existingPhotos: [],
  removedPhotos: [],
}

function AdminMandalForm({
  open,
  mode,
  initialValues,
  onClose,
  onSaved,
  recordId,
}: AdminMandalFormProps) {
  const [values, setValues] = useState<AdminMandalFormResult>(emptyState)
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const methods = useForm({
    defaultValues: {
      photos: [] as PhotoItem[],
      deletedPhotos: [] as unknown,
    },
  })

  useEffect(() => {
    if (!open) return
    setErrors({})
    const merged = { ...emptyState, ...initialValues }
    setValues(merged)
    methods.reset({
      photos: [...merged.existingPhotos],
      deletedPhotos: [],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues])

  const patch = (p: Partial<AdminMandalFormResult>) =>
    setValues((prev) => ({ ...prev, ...p }))

  const validate = (photos: PhotoItem[]): boolean => {
    const e: FormErrors = {}
    if (!values.mandal_name.trim()) e.mandal_name = 'मंडळाचे नाव भरा.'
    if (photos.length === 0) e.photos = 'किमान 1 फोटो आवश्यक.'
    if (!values.president_name.trim())
      e.president_name = 'अध्यक्षाचे नाव भरा.'
    if (!/^[6-9][0-9]{9}$/.test(values.president_mobile))
      e.president_mobile = 'कृपया योग्य 10 अंकी मोबाईल नंबर टाका.'
    if (!values.information_type)
      e.information_type = 'माहितीचा प्रकार निवडा.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const uploadNewPhotos = async (files: File[]): Promise<string[]> => {
    const compressed = await compressMultipleImages(files, {
      maxWidth: 1600,
      maxHeight: 1600,
      quality: 0.8,
      maxSizeKB: 500,
    })
    const urls: string[] = []
    for (const file of compressed) {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
      const name =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const path = `${name}.${ext}`

      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          contentType: file.type,
          upsert: false,
        })
      if (error) throw new Error(error.message)

      const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path)
      urls.push(data.publicUrl)
    }
    return urls
  }

  const handleSave = async () => {
    const rawPhotos =
      (methods.getValues('photos') as PhotoItem[] | undefined) ?? []

    if (!validate(rawPhotos)) return

    setSaving(true)
    try {
      const newFiles = rawPhotos.filter(
        (p): p is File => p instanceof File,
      )
      const keptUrls = rawPhotos.filter(
        (p): p is string => typeof p === 'string',
      )

      const newUrls = await uploadNewPhotos(newFiles)

      const removedUrls = values.existingPhotos.filter(
        (u) => !keptUrls.includes(u),
      )
      if (removedUrls.length > 0) {
        const paths = removedUrls
          .map((u) => u.split('/').pop() ?? '')
          .filter(Boolean)
        if (paths.length > 0) {
          await supabase.storage.from(BUCKET_NAME).remove(paths)
        }
      }

      const finalUrls = [...keptUrls, ...newUrls]
      const photoField = photoUrlsToString(finalUrls)

      const payload = {
        mandal_name: values.mandal_name.trim(),
        president_name: values.president_name.trim(),
        president_mobile: values.president_mobile,
        idol_photo_url: photoField,
        information_type: values.information_type,
      }

      if (mode === 'add') {
        const { error } = await supabase
          .from('ganesh_mandal_records_2026')
          .insert(payload)
        if (error) throw new Error(error.message)
        showSnackbar('success', 'नवीन नोंद जोडली गेली.')
      } else if (mode === 'edit' && recordId != null) {
        const { error } = await supabase
          .from('ganesh_mandal_records_2026')
          .update(payload)
          .eq('id', recordId)
        if (error) throw new Error(error.message)
        showSnackbar('success', 'नोंद अपडेट झाली.')
      }

      onSaved?.()
      onClose()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'काहीतरी चूक झाली.'
      showSnackbar('error', msg)
    } finally {
      setSaving(false)
    }
  }

  const title = mode === 'add' ? 'नवीन नोंद जोडा' : 'नोंद संपादित करा'

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: 'primary.dark' }}>
        {title}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <FormProvider {...methods}>
          <Stack spacing={2.5}>
            <TextField
              label="मंडळाचे नाव"
              value={values.mandal_name}
              onChange={(e) => patch({ mandal_name: e.target.value })}
              required
              fullWidth
              disabled={saving}
              error={Boolean(errors.mandal_name)}
              helperText={errors.mandal_name}
            />

            

            <TextField
              label="अध्यक्षाचे नाव"
              value={values.president_name}
              onChange={(e) => patch({ president_name: e.target.value })}
              required
              fullWidth
              disabled={saving}
              error={Boolean(errors.president_name)}
              helperText={errors.president_name}
            />

            <TextField
              label="अध्यक्षाचा मोबाईल नंबर"
              value={values.president_mobile}
              onChange={(e) => {
                const only = e.target.value
                  .replace(/\D/g, '')
                  .slice(0, 10)
                patch({ president_mobile: only })
              }}
              required
              fullWidth
              disabled={saving}
              error={Boolean(errors.president_mobile)}
              helperText={errors.president_mobile}
              slotProps={{
                htmlInput: { inputMode: 'numeric', maxLength: 10 },
              }}
            />

            <Box>
              <PhotoUpload
                name="photos"
                label="गणेशमूर्तीचे फोटो"
                placeholder="फोटो निवडा किंवा ड्रॉप करा"
                maxFiles={3}
                maxSizeMB={10}
                targetSizeKB={500}
                compress
                cropEnabled={false}
                cameraEnabled
                disabled={saving}
                size="medium"
                required
              />
              {errors.photos && (
                <Alert severity="error" sx={{ mt: 1.5 }}>
                  {errors.photos}
                </Alert>
              )}
            </Box>

            <FormControl
              disabled={saving}
              error={Boolean(errors.information_type)}
              component="fieldset"
            >
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary !important',
                }}
              >
                माहितीचा प्रकार{' '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  *
                </Box>
              </FormLabel>
              <RadioGroup
                value={values.information_type}
                onChange={(e) =>
                  patch({
                    information_type:
                      e.target.value as InformationType,
                  })
                }
              >
                <FormControlLabel
                  value={INFORMATION_TYPES.TAKEN}
                  control={<Radio />}
                  label={INFORMATION_TYPES.TAKEN}
                />
                <FormControlLabel
                  value={INFORMATION_TYPES.UPCOMING}
                  control={<Radio />}
                  label={INFORMATION_TYPES.UPCOMING}
                />
              </RadioGroup>
              {errors.information_type && (
                <Box
                  sx={{
                    color: 'error.main',
                    fontSize: 12,
                    mt: 0.5,
                    ml: 1.75,
                  }}
                >
                  {errors.information_type}
                </Box>
              )}
            </FormControl>
          </Stack>
        </FormProvider>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={saving}
        >
          रद्द करा
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
        >
          {saving
            ? 'सेव्ह होत आहे...'
            : mode === 'add'
              ? 'जोडा'
              : 'सेव्ह करा'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AdminMandalForm