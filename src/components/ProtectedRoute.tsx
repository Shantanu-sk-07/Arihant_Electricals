import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { supabase } from '../supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    let cancelled = false

    const check = async () => {
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session) {
        if (!cancelled) {
          setAllowed(false)
          setChecking(false)
        }
        return
      }

      const { data, error } = await supabase.rpc('is_admin')

      if (!cancelled) {
        setAllowed(!error && data === true)
        setChecking(false)
      }
    }

    check()

    return () => {
      cancelled = true
    }
  }, [])

  if (checking) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={48} sx={{ color: 'primary.main' }} />
        <Typography sx={{ color: 'text.secondary' }}>तपासत आहे...</Typography>
      </Box>
    )
  }

  if (!allowed) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute