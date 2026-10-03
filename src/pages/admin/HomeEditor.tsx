/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { SITE_CONTENT_FIELDS } from '@/constants/siteContent';
import { useContent } from '@/hooks/useContent';
import { showSnackbar } from '@/components/ToastMessage';

export default function HomeEditor() {
  const { content, loading, error, updateContents } = useContent('home');
  const [local, setLocal] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fields = SITE_CONTENT_FIELDS.home;

  useEffect(() => setLocal(content), [content]);

  const changes = useMemo(() => {
    const result: Record<string, string> = {};
    fields.forEach((field) => {
      const key = `${field.section}.${field.key}`;
      if ((local[key] ?? '') !== (content[key] ?? '')) result[key] = local[key] ?? '';
    });
    return result;
  }, [content, fields, local]);

  const save = async () => {
    if (!Object.keys(changes).length) {
      showSnackbar('info', 'There are no changes to save.');
      return;
    }
    setSaving(true);
    try {
      await updateContents(changes);
      showSnackbar('success', 'Home page content saved.');
    } catch (saveError) {
      showSnackbar('error', saveError instanceof Error ? saveError.message : 'Unable to save home page content.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack sx={{direction:{ xs: 'column', sm: 'row' }, justifyContent:"space-between", spacing:2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{fontWeight:800}}>Edit Home Page</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>Manage the home page copy and solar photography shown to visitors.</Typography>
        </Box>
        <Button variant="contained" onClick={save} disabled={saving || loading} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}>
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box role="status" aria-label="Loading home page content" sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {fields.map((field) => {
            const key = `${field.section}.${field.key}`;
            return (
              <Grid key={key} size={{ xs: 12, md: field.kind === 'multiline' ? 12 : 6 }}>
                <TextField
                  fullWidth
                  label={field.label}
                  multiline={field.kind === 'multiline'}
                  minRows={field.kind === 'multiline' ? 3 : undefined}
                  value={local[key] ?? ''}
                  onChange={(event) => setLocal((current) => ({ ...current, [key]: event.target.value }))}
                />
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
