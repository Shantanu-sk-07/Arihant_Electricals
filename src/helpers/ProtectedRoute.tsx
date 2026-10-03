import { useEffect, useState, type ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { CircularProgress, Box } from '@mui/material';

export default function ProtectedRoute({
  children,
}: {
  children: ReactElement;
}) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setAuthed(!!s)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    );
  if (!authed) return <Navigate to="/" replace />;
  return children;
}