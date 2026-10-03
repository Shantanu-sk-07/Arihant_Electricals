import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  Stack,
  Avatar,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useSettings } from '../../hooks/useSettings';
import { supabase } from '../../lib/supabase';
import TextInputField from '../../components/TextInputField';
import { showSnackbar } from '@/components/ToastMessage';

interface SettingsForm {
  site_name: string;
  phone: string;
  email: string;
  address: string;
}

export default function Settings() {
  const { settings, loading, error, updateSetting, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const syncedRef = useRef<string>('');

  const methods = useForm<SettingsForm>({
    defaultValues: { site_name: '', phone: '', email: '', address: '' },
  });

  useEffect(() => {
    const sig = JSON.stringify({
      site_name: settings.site_name ?? '',
      phone: settings.phone ?? '',
      email: settings.email ?? '',
      address: settings.address ?? '',
    });
    if (syncedRef.current !== sig) {
      syncedRef.current = sig;
      methods.reset({
        site_name: settings.site_name ?? '',
        phone: settings.phone ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
      });
    }
  }, [settings, methods]);

  const save = async (data: SettingsForm) => {
    const changed = Object.fromEntries(
      (Object.keys(data) as (keyof SettingsForm)[])
        .filter((key) => data[key] !== settings[key])
        .map((key) => [key, data[key]]),
    );
    if (Object.keys(changed).length === 0) {
      showSnackbar('info', 'There are no changes to save.');
      return;
    }
    setSaving(true);
    try {
      await updateSettings(changed);
      showSnackbar('success', 'Site settings saved.');
    } catch (saveError) {
      showSnackbar('error', saveError instanceof Error ? saveError.message : 'Unable to save site settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogo = async (file: File) => {
    setUploading(true);
    try {
      const path = `logo-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      await updateSetting('logo_url', data.publicUrl);
      showSnackbar('success', 'Logo updated.');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      showSnackbar('error', `Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Site Settings
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3, alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        {settings.logo_url && (
          <Avatar src={settings.logo_url} sx={{ width: 64, height: 64 }} />
        )}
        <Button variant="outlined" component="label" disabled={uploading} startIcon={uploading ? <CircularProgress size={18} /> : undefined}>
          {uploading ? 'Uploading…' : 'Upload Logo'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleLogo(f);
            }}
          />
        </Button>
      </Stack>

      {loading ? (
        <Box role="status" aria-label="Loading site settings" sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      ) : <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(save)}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInputField
                name="site_name"
                label="Site Name"
                inputType="all"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInputField name="phone" label="Phone" inputType="all" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                {...methods.register('email')}
                error={!!methods.formState.errors.email}
                helperText={methods.formState.errors.email?.message || ' '}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInputField
                name="address"
                label="Address"
                inputType="all"
                rows={2}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Button variant="contained" size="large" type="submit" disabled={saving} startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}>
                {saving ? 'Saving…' : 'Save Settings'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </FormProvider>}

    </Box>
  );
}