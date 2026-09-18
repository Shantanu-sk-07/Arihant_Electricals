import {
  useState,
  type FormEvent,
} from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { ADMIN_WHATSAPP, BUCKET_NAME, supabase } from '../supabase'
import { INFORMATION_TYPES, type InformationType } from '../types'
import { photoUrlsToString } from '../utils/photoUtils'
import { showSnackbar } from '../components/ToastMessage'
import PhotoUpload from '../components/PhotoUpload'

interface FormValues {
  mandal_name: string
  president_name: string
  president_mobile: string
  information_type: InformationType | ''
}

interface FormErrors {
  mandal_name?: string
  president_name?: string
  president_mobile?: string
  information_type?: string
  photos?: string
}

const initialValues: FormValues = {
  mandal_name: '',
  president_name: '',
  president_mobile: '',
  information_type: '',
}

type PhotoItem = File | string

function PublicMandalForm() {
  const [values, setValues] = useState<FormValues>(initialValues)
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  const methods = useForm({
    defaultValues: {
      photos: [] as PhotoItem[],
      deletedPhotos: [] as unknown,
    },
  })

  const patch = (p: Partial<FormValues>) =>
    setValues((prev) => ({ ...prev, ...p }))

  const validate = (photos: PhotoItem[]): boolean => {
    const e: FormErrors = {}
    if (!values.mandal_name.trim()) e.mandal_name = 'मंडळाचे नाव भरा.'
    if (photos.length === 0) e.photos = 'गणेशमूर्तीचा फोटो अपलोड करा.'
    if (!values.president_name.trim())
      e.president_name = 'अध्यक्षाचे नाव भरा.'
    if (!/^[6-9][0-9]{9}$/.test(values.president_mobile))
      e.president_mobile = 'कृपया योग्य 10 अंकी मोबाईल नंबर टाका.'
    if (!values.information_type)
      e.information_type = 'माहितीचा प्रकार निवडा.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return
    setSuccess(false)

    const rawPhotos =
      (methods.getValues('photos') as PhotoItem[] | undefined) ?? []
    const filePhotos = rawPhotos.filter(
      (p): p is File => p instanceof File,
    )

    if (!validate(rawPhotos)) return

    setLoading(true)
    const uploadedPaths: string[] = []

    try {
      const urls: string[] = []
      for (const file of filePhotos) {
        const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
        const name =
          typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`
        const path = `${name}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(path, file, {
            cacheControl: '3600',
            contentType: file.type,
            upsert: false,
          })

        if (uploadError)
          throw new Error(
            `फोटो अपलोड झाला नाही: ${uploadError.message}`,
          )

        uploadedPaths.push(path)

        const { data } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(path)
        urls.push(data.publicUrl)
      }

      const { error: dbError } = await supabase
        .from('ganesh_mandal_records_2026')
        .insert({
          mandal_name: values.mandal_name.trim(),
          president_name: values.president_name.trim(),
          president_mobile: values.president_mobile,
          idol_photo_url: photoUrlsToString(urls),
          information_type: values.information_type,
        })

      if (dbError) {
        await supabase.storage.from(BUCKET_NAME).remove(uploadedPaths)
        throw new Error(`माहिती सेव्ह झाली नाही: ${dbError.message}`)
      }

      const message = [
        '🙏 नवीन गणेशमूर्ती मंडळ नोंदणी',
        '',
        `मंडळाचे नाव: ${values.mandal_name.trim()}`,
        `अध्यक्षाचे नाव: ${values.president_name.trim()}`,
        `मोबाईल नंबर: ${values.president_mobile}`,
        `माहितीचा प्रकार: ${values.information_type}`,
        '',
        '📷 मूर्तीचे फोटो:',
        ...urls.map((u, i) => `Photo ${i + 1}: ${u}`),
      ].join('\n')

      const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
        message,
      )}`

      setWhatsappUrl(waUrl)
      setSuccess(true)
      setValues(initialValues)
      setErrors({})
      methods.reset({ photos: [], deletedPhotos: [] })
      showSnackbar('success', 'माहिती यशस्वीरित्या नोंदवली गेली!')
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.'
      showSnackbar('error', msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2 },
        position: 'relative',
        background:
          'radial-gradient(circle at top, #fffaf4 0%, #f6efe6 45%, #eee1d2 100%)',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: '10%',
          right: '-80px',
          fontSize: 260,
          opacity: 0.04,
          color: '#7c2905',
          fontWeight: 900,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        ॐ
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          bottom: '-40px',
          left: '-60px',
          fontSize: 200,
          opacity: 0.035,
          color: '#7c2905',
          fontWeight: 900,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        ॐ
      </Box>

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
            background:
              'linear-gradient(135deg, #fffdfa 0%, #faf3ea 100%)',
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              mx: 'auto',
              mb: 1.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(145deg, #b96b13, #7c3907)',
              color: '#fff8e8',
              fontSize: 24,
              fontWeight: 700,
              boxShadow: '0 8px 20px rgba(126, 64, 13, 0.28)',
            }}
          >
            ॐ
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: 'primary.dark',
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: 20, sm: 26 },
            }}
          >
            गणेशमूर्ती मंडळ माहिती नोंदणी २०२६
          </Typography>

          <Typography
            sx={{
              color: 'text.secondary',
              fontSize: { xs: 13, sm: 14 },
              lineHeight: 1.7,
              maxWidth: 560,
              mx: 'auto',
            }}
          >
            २०२६ मध्ये गणेशमूर्ती घेतलेल्या तसेच आगामी वर्षासाठी
            अपेक्षित असलेल्या मंडळांनी खालील माहिती अचूकपणे भरावी.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField
                  label="मंडळाचे नाव"
                  value={values.mandal_name}
                  onChange={(e) =>
                    patch({ mandal_name: e.target.value })
                  }
                  placeholder="उदा. श्री गणेश मित्र मंडळ"
                  required
                  fullWidth
                  error={Boolean(errors.mandal_name)}
                  helperText={errors.mandal_name}
                  autoComplete="organization"
                />

                
                <TextField
                  label="अध्यक्षाचे नाव"
                  value={values.president_name}
                  onChange={(e) =>
                    patch({ president_name: e.target.value })
                  }
                  placeholder="अध्यक्षाचे पूर्ण नाव"
                  required
                  fullWidth
                  error={Boolean(errors.president_name)}
                  helperText={errors.president_name}
                  autoComplete="name"
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
                  placeholder="10 अंकी मोबाईल नंबर"
                  required
                  fullWidth
                  error={Boolean(errors.president_mobile)}
                  helperText={errors.president_mobile}
                  autoComplete="tel"
                  slotProps={{
                    htmlInput: {
                      inputMode: 'numeric',
                      maxLength: 10,
                    },
                  }}
                />

                <Box>
                  <PhotoUpload
                    name="photos"
                    label="मंडळाच्या सजावट/डिझाइनमधील गणेशमूर्तीचे फोटो"
                    placeholder="फोटो निवडा किंवा ड्रॉप करा"
                    maxFiles={3}
                    maxSizeMB={10}
                    targetSizeKB={500}
                    compress
                    cropEnabled={false}
                    cameraEnabled
                    size="medium"
                    required
                  />
                  {errors.photos && (
                    <Box
                      sx={{
                        color: 'error.main',
                        fontSize: 12,
                        mt: 0.5,
                        ml: 1.75,
                      }}
                    >
                      {errors.photos}
                    </Box>
                  )}
                </Box>


                <FormControl
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
                    <Box
                      component="span"
                      sx={{ color: 'error.main' }}
                    >
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

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 3,
                  py: 1.6,
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {loading
                  ? 'कृपया थांबा...'
                  : 'Submit & WhatsApp वर पाठवा'}
              </Button>

              {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography sx={{ fontWeight: 700 }}>
                    🙏 धन्यवाद!
                  </Typography>
                  आपल्या मंडळाची माहिती यशस्वीरित्या नोंदवली गेली आहे.
                  <br />
                  गणेशमूर्तीचा फोटो व इतर माहिती प्राप्त झाली आहे.
                  <br />
                  <br />
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontWeight: 700 }}
                  >
                    WhatsApp पुन्हा उघडा
                  </a>
                </Alert>
              )}
            </form>
          </FormProvider>
        </Paper>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            fontSize: 13,
            pb: 2,
          }}
        >
         
          <MuiLink
            component={Link}
            to="/admin/login"
            sx={{
              color: 'text.secondary',
              textDecoration: 'underline',
            }}
          >
           <span>गणेशमूर्ती मंडळ माहिती नोंदणी • २०२६</span>
          <span>•</span>
          </MuiLink>
        </Box>
      </Container>
    </Box>
  )
}

export default PublicMandalForm