import { useState, useEffect, type FormEvent } from 'react'
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setAlreadyLoggedIn(true)
    })
  }, [])

  if (alreadyLoggedIn) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (signInError) throw new Error('ईमेल किंवा पासवर्ड चुकीचा आहे.')
      if (!data.session) throw new Error('लॉगिन अयशस्वी.')

      const { data: isAdmin, error: rpcError } =
        await supabase.rpc('is_admin')

      if (rpcError || isAdmin !== true) {
        await supabase.auth.signOut()
        throw new Error('हा युजर अ‍ॅडमिन नाही.')
      }

      navigate('/admin', { replace: true })
    } catch (err) {
      if (err instanceof Error) setError(err.message)
      else setError('काहीतरी चूक झाली.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 4,
        px: 2,
        background:
          'radial-gradient(circle at top, #fffaf4 0%, #f6efe6 45%, #eee1d2 100%)',
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            border: '1px solid',
            borderColor: 'divider',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(75, 45, 20, 0.12)',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              mx: 'auto',
              mb: 2.5,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(145deg, #b96b13, #7c3907)',
              color: '#fff8e8',
              fontSize: 32,
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(126, 64, 13, 0.3)',
            }}
          >
            ॐ
          </Box>

          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'primary.dark',
              mb: 0.5,
              letterSpacing: '-0.3px',
            }}
          >
            अ‍ॅडमिन लॉगिन
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3.5 }}
          >
            फक्त अधिकृत अ‍ॅडमिनसाठी
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                label="ईमेल"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
                fullWidth
              />

              <TextField
                label="पासवर्ड"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((prev) => !prev)
                          }
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  py: 1.5,
                  fontWeight: 800,
                  fontSize: 15,
                  borderRadius: 2,
                }}
              >
                {loading ? 'तपासत आहे...' : 'Login'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminLogin