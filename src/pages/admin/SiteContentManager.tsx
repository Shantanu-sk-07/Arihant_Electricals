/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { CloudUpload, Save } from '@mui/icons-material';
import { SITE_CONTENT_FIELDS, SITE_CONTENT_PAGES, type SiteContentPage } from '@/constants/siteContent';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/lib/supabase';
import { showSnackbar } from '@/components/ToastMessage';

export default function SiteContentManager() {
  const [page, setPage] = useState<SiteContentPage>('home');
  const { content, loading, error, updateContents } = useContent(page);
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const fields = SITE_CONTENT_FIELDS[page];

  useEffect(() => {
    setValues(content);
  }, [content]);

  const dirtyValues = useMemo(() => {
    const changed: Record<string, string> = {};
    for (const field of fields) {
      const key = `${field.section}.${field.key}`;
      if ((values[key] ?? '') !== (content[key] ?? '')) changed[key] = values[key] ?? '';
    }
    return changed;
  }, [content, fields, values]);

  const setFieldValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const uploadImage = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const safeName = file.name.replace(/[^\w.-]/g, '-');
      const path = `site-content/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage.from('media').upload(path, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      setFieldValue(key, data.publicUrl);
      showSnackbar('success', 'Image uploaded. Save changes to publish it.');
    } catch (uploadError) {
      showSnackbar(
        'error',
        uploadError instanceof Error ? uploadError.message : 'Unable to upload this image.',
      );
    } finally {
      setUploadingKey(null);
    }
  };

  const save = async () => {
    if (!Object.keys(dirtyValues).length) {
      showSnackbar('info', 'There are no changes to save.');
      return;
    }
    setSaving(true);
    try {
      await updateContents(dirtyValues);
      showSnackbar('success', 'Website content saved.');
    } catch (saveError) {
      showSnackbar(
        'error',
        saveError instanceof Error ? saveError.message : 'Unable to save website content.',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Website content</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Update page copy and imagery without changing your website structure.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
          onClick={save}
          disabled={saving || loading || Boolean(uploadingKey)}
          sx={{ alignSelf: { xs: 'stretch', sm: 'center' } }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>

      <Card sx={{ mb: 2.5 }}>
        <CardContent>
          <TextField
            select
            fullWidth
            label="Page to edit"
            value={page}
            onChange={(event) => setPage(event.target.value as SiteContentPage)}
          >
            {SITE_CONTENT_PAGES.map((item) => (
              <MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box role="status" aria-label="Loading website content" sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {fields.map((field) => {
            const key = `${field.section}.${field.key}`;
            const value = values[key] ?? '';
            return (
              <Grid key={key} size={{ xs: 12, md: field.kind === 'image' ? 12 : field.kind === 'multiline' ? 12 : 6 }}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    {field.kind === 'image' ? (
                      <Stack spacing={1.5}>
                        <TextField
                          fullWidth
                          label={`${field.label} URL`}
                          value={value}
                          onChange={(event) => setFieldValue(key, event.target.value)}
                        />
                        <Button
                          component="label"
                          variant="outlined"
                          startIcon={uploadingKey === key
                            ? <CircularProgress size={18} />
                            : <CloudUpload />}
                          disabled={Boolean(uploadingKey)}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          {uploadingKey === key ? 'Uploading…' : 'Upload image'}
                          <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadImage(key, file);
                              event.target.value = '';
                            }}
                          />
                        </Button>
                        {value && (
                          <Box
                            component="img"
                            src={value}
                            alt={`${field.label} preview`}
                            sx={{ width: '100%', maxWidth: 560, maxHeight: 260, objectFit: 'cover', borderRadius: 2 }}
                          />
                        )}
                      </Stack>
                    ) : (
                      <TextField
                        fullWidth
                        label={field.label}
                        value={value}
                        multiline={field.kind === 'multiline'}
                        minRows={field.kind === 'multiline' ? 3 : undefined}
                        onChange={(event) => setFieldValue(key, event.target.value)}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
