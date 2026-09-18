import { useState, useEffect, useRef, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  GlobalStyles,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

// ---------------------------------------------------------------------------
// Palette (temple-at-dusk, distinct from the generic cream/terracotta look):
//   deep sanctum maroon  #1c0a06 -> #3a1409   (outer background)
//   sindoor vermilion     #b8380f              (primary accent / CTA)
//   marigold              #e6a11c              (secondary accent / glow)
//   antique gold          #caa869              (borders, medallion ring)
//   parchment ivory       #fdf6ea -> #f7ecd8   (card surface)
//   deep maroon text      #4a1508              (headline on card)
//   warm umber text       #6b4a35              (body / secondary text)
//   peacock teal          #1f6f66              (single quiet accent line)
// ---------------------------------------------------------------------------

function MandalaBackdrop() {
  const petals = Array.from({ length: 16 })
  const dots = Array.from({ length: 24 })

  return (
    <Box
      component="svg"
      viewBox="0 0 600 600"
      aria-hidden="true"
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: { xs: 520, sm: 720, md: 880 },
        height: { xs: 520, sm: 720, md: 880 },
        transform: 'translate(-50%, -50%)',
        opacity: 0.16,
        animation: 'mandalaRotate 140s linear infinite',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
      }}
    >
      <circle cx="300" cy="300" r="290" fill="none" stroke="#e6a11c" strokeWidth="1" />
      <circle cx="300" cy="300" r="230" fill="none" stroke="#caa869" strokeWidth="1" />
      <circle cx="300" cy="300" r="170" fill="none" stroke="#e6a11c" strokeWidth="1" />
      {petals.map((_, i) => {
        const angle = (360 / petals.length) * i
        return (
          <ellipse
            key={i}
            cx="300"
            cy="80"
            rx="14"
            ry="46"
            fill="none"
            stroke="#e6a11c"
            strokeWidth="1.2"
            transform={`rotate(${angle} 300 300)`}
          />
        )
      })}
      {dots.map((_, i) => {
        const angle = (360 / dots.length) * i
        const rad = (angle * Math.PI) / 180
        const x = 300 + 250 * Math.cos(rad)
        const y = 300 + 250 * Math.sin(rad)
        return <circle key={i} cx={x} cy={y} r="3" fill="#caa869" />
      })}
    </Box>
  )
}

function OmMedallion({ pulsing }: { pulsing: boolean }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: -46,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 92,
        height: 92,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at 32% 28%, #4a1a0a, #1c0a06 75%)',
        border: '3px solid',
        borderColor: '#caa869',
        boxShadow: pulsing
          ? '0 0 0 6px rgba(230,161,28,0.12), 0 12px 30px rgba(28,10,6,0.55)'
          : '0 12px 30px rgba(28,10,6,0.55)',
        animation: 'medallionGlow 3.6s ease-in-out infinite',
        '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
        zIndex: 2,
      }}
    >
      <Typography
        aria-hidden="true"
        sx={{
          fontSize: 42,
          lineHeight: 1,
          color: '#f3d99a',
          fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
          textShadow: '0 0 14px rgba(243,217,154,0.55)',
        }}
      >
        ॐ
      </Typography>
    </Box>
  )
}

function GarlandDivider() {
  return (
    <Box
      aria-hidden="true"
      sx={{
        height: 10,
        width: '72%',
        mx: 'auto',
        mt: 5.5,
        mb: 1,
        backgroundImage:
          'radial-gradient(circle, #e6a11c 0 3.5px, transparent 4px)',
        backgroundSize: '16px 10px',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        opacity: 0.85,
      }}
    />
  )
}

function AdminLogin() {
  const navigate = useNavigate()
  const emailRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let active = true
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) setAlreadyLoggedIn(true)
      setCheckingSession(false)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!checkingSession && !alreadyLoggedIn) {
      emailRef.current?.focus()
    }
  }, [checkingSession, alreadyLoggedIn])

  if (alreadyLoggedIn) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setError('')

    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('कृपया ईमेल आणि पासवर्ड दोन्ही भरा.')
      return
    }

    setLoading(true)

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })

      if (signInError) throw new Error('ईमेल किंवा पासवर्ड चुकीचा आहे.')
      if (!data.session) throw new Error('लॉगिन अयशस्वी. पुन्हा प्रयत्न करा.')

      const { data: isAdmin, error: rpcError } =
        await supabase.rpc('is_admin')

      if (rpcError || isAdmin !== true) {
        await supabase.auth.signOut()
        throw new Error('हा युजर अ‍ॅडमिन नाही.')
      }

      navigate('/admin', { replace: true })
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('काहीतरी चूक झाली. पुन्हा प्रयत्न करा.')
      setLoading(false)
    }
  }

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes mandalaRotate': {
            from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
            to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
          },
          '@keyframes medallionGlow': {
            '0%, 100%': { filter: 'brightness(1)' },
            '50%': { filter: 'brightness(1.18)' },
          },
          '@keyframes cardRise': {
            from: { opacity: 0, transform: 'translateY(22px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      />

      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          py: 6,
          px: 2,
          background:
            'radial-gradient(circle at 50% 15%, #4a1a0a 0%, #2c0e07 42%, #1c0a06 78%, #130604 100%)',
        }}
      >
        {/* ambient marigold glow */}
        <Box
          aria-hidden="true"
          sx={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            width: 520,
            height: 520,
            transform: 'translate(-50%, -50%)',
            background:
              'radial-gradient(circle, rgba(230,161,28,0.28) 0%, rgba(230,161,28,0) 68%)',
            filter: 'blur(4px)',
            pointerEvents: 'none',
          }}
        />

        <MandalaBackdrop />

        <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
          {checkingSession ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                color: '#f3d99a',
              }}
            >
              <CircularProgress size={34} sx={{ color: '#e6a11c' }} />
              <Typography
                variant="body2"
                sx={{ fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif" }}
              >
                सत्र तपासत आहे...
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'relative',
                pt: 7,
                pb: { xs: 4, sm: 5 },
                px: { xs: 3.5, sm: 5 },
                borderRadius: '28px',
                background: 'linear-gradient(180deg, #fdf6ea 0%, #f7ecd8 100%)',
                border: '1px solid rgba(202,168,105,0.6)',
                boxShadow:
                  '0 30px 70px rgba(10,4,2,0.55), 0 0 0 1px rgba(230,161,28,0.08) inset',
                textAlign: 'center',
                animation: 'cardRise 0.6s cubic-bezier(0.22,1,0.36,1) both',
                '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
              }}
            >
              <OmMedallion pulsing={!loading} />

              <Typography
                variant="h5"
                sx={{
                  fontFamily: "'Noto Serif Devanagari', 'Georgia', serif",
                  fontWeight: 700,
                  color: '#4a1508',
                  letterSpacing: '0.2px',
                }}
              >
                अ‍ॅडमिन लॉगिन
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  mt: 0.75,
                  color: '#6b4a35',
                  fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
                }}
              >
                मंडळ व्यवस्थापन प्रणालीमध्ये प्रवेश करण्यासाठी लॉगिन करा
              </Typography>

              <GarlandDivider />

              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ mt: 3, textAlign: 'left' }}
              >
                <Stack spacing={2.25}>
                  <TextField
                    inputRef={emailRef}
                    label="ईमेल"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    disabled={loading}
                    fullWidth
                    sx={fieldSx}
                  />

                  <TextField
                    label="पासवर्ड"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    fullWidth
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword((prev) => !prev)}
                              edge="end"
                              size="small"
                              disabled={loading}
                              aria-label={
                                showPassword ? 'पासवर्ड लपवा' : 'पासवर्ड दाखवा'
                              }
                              sx={{ color: '#8a5a2e' }}
                            >
                              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
                        backgroundColor: 'rgba(184,56,15,0.08)',
                        color: '#7a2a0c',
                        border: '1px solid rgba(184,56,15,0.35)',
                        '& .MuiAlert-icon': { color: '#b8380f' },
                      }}
                    >
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    disabled={loading}
                    fullWidth
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} sx={{ color: '#fdf6ea' }} />
                      ) : undefined
                    }
                    sx={{
                      py: 1.4,
                      mt: 0.5,
                      borderRadius: '14px',
                      fontWeight: 700,
                      fontSize: 15,
                      color: '#fdf6ea',
                      fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #b8380f 0%, #e6a11c 100%)',
                      boxShadow: '0 10px 24px rgba(184,56,15,0.35)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #a2300c 0%, #d19216 100%)',
                        boxShadow: '0 12px 28px rgba(184,56,15,0.45)',
                      },
                      '&.Mui-disabled': {
                        color: 'rgba(253,246,234,0.75)',
                        background: 'linear-gradient(135deg, #99551f 0%, #b6871f 100%)',
                      },
                    }}
                  >
                    {loading ? 'पडताळत आहे...' : 'प्रवेश करा'}
                  </Button>
                </Stack>
              </Box>

              <Box
                aria-hidden="true"
                sx={{
                  mt: 3.5,
                  height: 2,
                  width: 56,
                  mx: 'auto',
                  borderRadius: 1,
                  background: 'linear-gradient(90deg, #b8380f, #1f6f66, #e6a11c)',
                  opacity: 0.7,
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  )
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.55)',
    fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
    '& fieldset': { borderColor: 'rgba(180,120,40,0.35)', borderWidth: 1.5 },
    '&:hover fieldset': { borderColor: '#e6a11c' },
    '&.Mui-focused fieldset': { borderColor: '#b8380f', borderWidth: 2 },
  },
  '& .MuiInputLabel-root': {
    color: '#6b4a35',
    fontFamily: "'Noto Sans Devanagari', system-ui, sans-serif",
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#b8380f' },
  '& .MuiInputBase-input': { color: '#4a1508' },
} as const

export default AdminLogin
