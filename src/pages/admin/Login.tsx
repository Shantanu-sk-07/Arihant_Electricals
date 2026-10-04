import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  SolarPower as SolarIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { BRAND } from '@/constants/Brand';
import ThemeModeToggle from '@/layout/ThemeModeToggle';
import { showSnackbar } from '@/components/ToastMessage';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
if (error) throw error;

console.log('LOGIN RESULT:', data);
console.log('ACCESS TOKEN:', data.session?.access_token);
console.log('USER:', data.session?.user);

const { data: sessionData } = await supabase.auth.getSession();
console.log('SESSION AFTER LOGIN:', sessionData);

nav('/admin');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to sign in. Please try again.';
      setErr(message);
      showSnackbar('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
        background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primaryDark} 55%, ${BRAND.primary} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.08) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(0,184,212,0.15) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      }}
    >
      {/* Theme toggle — top right */}
      <Box
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          zIndex: 2,
          color: 'white',
        }}
      >
        <ThemeModeToggle />
      </Box>

      {/* Back to website — top left */}
      <Link
        component={RouterLink}
        to="/"
        sx={{
          position: 'absolute',
          top: { xs: 16, sm: 24 },
          left: { xs: 16, sm: 24 },
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          color: 'rgba(255,255,255,0.9)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: 600,
          px: 2,
          py: 1,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          zIndex: 2,
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.2)',
            transform: 'translateX(-2px)',
          },
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        Back to Website
      </Link>

      <Card
        sx={{
          width: '100%',
          maxWidth: 420,
          borderRadius: 4,
          boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
            color: 'white',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.5,
            }}
          >
            <SolarIcon sx={{ fontSize: 36 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem' }}>
            Arihant Electricals
          </Typography>
          <Typography sx={{ opacity: 0.9, mt: 0.5, fontSize: '0.85rem' }}>
            Admin Control Panel
          </Typography>
        </Box>

        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5, fontSize: '1.1rem' }}>
            Welcome Back
          </Typography>
          <Typography sx={{ color: 'text.secondary', mb: 3, fontSize: '0.875rem' }}>
            Sign in to manage your website
          </Typography>

          {err && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {err}
            </Alert>
          )}

          <form onSubmit={submit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: BRAND.primary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: BRAND.primary },
                  },
                  '& label.Mui-focused': { color: BRAND.primary },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: BRAND.primary, fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="small"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': { borderColor: BRAND.primary },
                  },
                  '& label.Mui-focused': { color: BRAND.primary },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null
                }
                sx={{
                  bgcolor: BRAND.primary,
                  py: 1.5,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: `0 8px 24px ${BRAND.primary}40`,
                  '&:hover': {
                    bgcolor: BRAND.primaryDark,
                    boxShadow: `0 12px 32px ${BRAND.primary}60`,
                  },
                  '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography sx={{ color: 'text.secondary', display: 'block', mb: 1, fontSize: '0.75rem' }}>
              Not an admin?
            </Typography>
            <Link
              component={RouterLink}
              to="/"
              sx={{
                color: BRAND.primary,
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              ← Back to Homepage
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}