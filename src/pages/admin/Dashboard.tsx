import { Grid, Card, CardContent, Typography, CircularProgress, Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { showSnackbar } from '@/components/ToastMessage';

export default function Dashboard() {
  const [stats, setStats] = useState({ media: 0, contacts: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [mediaResult, contactsResult, unreadResult] = await Promise.all([
          supabase.from('media').select('id', { count: 'exact', head: true }),
          supabase.from('contacts').select('id', { count: 'exact', head: true }),
          supabase
            .from('contacts')
            .select('id', { count: 'exact', head: true })
            .eq('is_read', false),
        ]);
        const failedResult = [mediaResult, contactsResult, unreadResult].find((result) => result.error);
        if (failedResult?.error) throw failedResult.error;
        setStats({
          media: mediaResult.count ?? 0,
          contacts: contactsResult.count ?? 0,
          unread: unreadResult.count ?? 0,
        });
      } catch (error) {
        showSnackbar('error', error instanceof Error ? error.message : 'Unable to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: 'Media Items', value: stats.media },
    { label: 'Total Contacts', value: stats.contacts },
    { label: 'Unread Messages', value: stats.unread },
  ];

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {cards.map(c => (
          <Grid size={{ xs: 12, sm: 4 }} key={c.label}>
            <Card>
              <CardContent>
                <Stack spacing={1}>
                  <Typography color="text.secondary">{c.label}</Typography>
                  {loading ? (
                    <Box role="status" aria-label={`Loading ${c.label}`} sx={{ minHeight: 48, display: 'flex', alignItems: 'center' }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <Typography variant="h3">{c.value}</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}