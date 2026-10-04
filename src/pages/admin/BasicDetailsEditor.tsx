import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  Alert,
} from '@mui/material';
import {
  Save,
  CloudUpload,
  RestartAlt,
  Delete,
  Visibility,
  Mail as MailIcon,
  Instagram,
  Facebook,
  YouTube,
  LinkedIn,
} from '@mui/icons-material';
import { FormProvider, useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSettings } from '@/hooks/useSettings';
import { supabase } from '@/lib/supabase';
import type { Contact } from '@/types';
import TextInputField from '@/components/TextInputField';
import EmailField from '@/components/EmailField';
import MobileField from '@/components/MobileField';
import { BRAND } from '@/constants/Brand';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';

const LOGO_MAX_WIDTH = 200;
const LOGO_MAX_HEIGHT = 60;

interface FormValues {
  site_name: string;
  tagline: string;
  gst_number: string;
  phone_1: string;
  phone_1_name: string;
  team_1_role: string;
  phone_2: string;
  phone_2_name: string;
  team_2_role: string;
  email: string;
  address: string;
  whatsapp_1: string;
  whatsapp_1_name: string;
  whatsapp_2: string;
  whatsapp_2_name: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  linkedin_url: string;
  stat_installations: string;
  stat_capacity: string;
  stat_experience: string;
  stat_subsidy: string;
}

const EMPTY: FormValues = {
  site_name: '',
  tagline: '',
  gst_number: '',
  phone_1: '',
  phone_1_name: '',
  team_1_role: '',
  phone_2: '',
  phone_2_name: '',
  team_2_role: '',
  email: '',
  address: '',
  whatsapp_1: '',
  whatsapp_1_name: '',
  whatsapp_2: '',
  whatsapp_2_name: '',
  instagram_url: '',
  facebook_url: '',
  youtube_url: '',
  linkedin_url: '',
  stat_installations: '',
  stat_capacity: '',
  stat_experience: '',
  stat_subsidy: '',
};

const CONTACTS_KEY = ['contacts'] as const;

async function fetchContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Contact[]) ?? [];
}

export default function BasicDetailsEditor() {
  const { settings, loading, error, updateSettings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);
  const syncedRef = useRef<string>('');

  const methods = useForm<FormValues>({ defaultValues: EMPTY });

  useEffect(() => {
    const sig = JSON.stringify({
      site_name: settings.site_name ?? '',
      tagline: settings.tagline ?? '',
      gst_number: settings.gst_number ?? '',
      phone_1: settings.phone_1 ?? '',
      phone_1_name: settings.phone_1_name ?? '',
      team_1_role: settings.team_1_role ?? '',
      phone_2: settings.phone_2 ?? '',
      phone_2_name: settings.phone_2_name ?? '',
      team_2_role: settings.team_2_role ?? '',
      email: settings.email ?? '',
      address: settings.address ?? '',
      whatsapp_1: settings.whatsapp_1 ?? '',
      whatsapp_1_name: settings.whatsapp_1_name ?? '',
      whatsapp_2: settings.whatsapp_2 ?? '',
      whatsapp_2_name: settings.whatsapp_2_name ?? '',
      instagram_url: settings.instagram_url ?? '',
      facebook_url: settings.facebook_url ?? '',
      youtube_url: settings.youtube_url ?? '',
      linkedin_url: settings.linkedin_url ?? '',
      stat_installations: settings.stat_installations ?? '',
      stat_capacity: settings.stat_capacity ?? '',
      stat_experience: settings.stat_experience ?? '',
      stat_subsidy: settings.stat_subsidy ?? '',
    });
    if (syncedRef.current !== sig) {
      syncedRef.current = sig;
      methods.reset({
        site_name: settings.site_name ?? '',
        tagline: settings.tagline ?? '',
        gst_number: settings.gst_number ?? '',
        phone_1: settings.phone_1 ?? '',
        phone_1_name: settings.phone_1_name ?? '',
        team_1_role: settings.team_1_role ?? '',
        phone_2: settings.phone_2 ?? '',
        phone_2_name: settings.phone_2_name ?? '',
        team_2_role: settings.team_2_role ?? '',
        email: settings.email ?? '',
        address: settings.address ?? '',
        whatsapp_1: settings.whatsapp_1 ?? '',
        whatsapp_1_name: settings.whatsapp_1_name ?? '',
        whatsapp_2: settings.whatsapp_2 ?? '',
        whatsapp_2_name: settings.whatsapp_2_name ?? '',
        instagram_url: settings.instagram_url ?? '',
        facebook_url: settings.facebook_url ?? '',
        youtube_url: settings.youtube_url ?? '',
        linkedin_url: settings.linkedin_url ?? '',
        stat_installations: settings.stat_installations ?? '',
        stat_capacity: settings.stat_capacity ?? '',
        stat_experience: settings.stat_experience ?? '',
        stat_subsidy: settings.stat_subsidy ?? '',
      });
    }
  }, [settings, methods]);

  const onSubmit = async (values: FormValues) => {
    const changed: Record<string, string> = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((key) => {
      if (values[key] !== (settings[key] ?? '')) {
        changed[key] = values[key];
      }
    });
    if (Object.keys(changed).length === 0) {
      showSnackbar('info', 'There are no changes to save.');
      return;
    }
    setSaving(true);
    try {
      await updateSettings(changed);
      showSnackbar('success', 'Basic details saved.');
    } catch (saveError) {
      showSnackbar(
        'error',
        saveError instanceof Error ? saveError.message : 'Unable to save basic details.',
      );
    } finally {
      setSaving(false);
    }
  };

  const resizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const ratio = Math.min(LOGO_MAX_WIDTH / width, LOGO_MAX_HEIGHT / height, 1);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }
        URL.revokeObjectURL(objectUrl);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/png' }));
            } else {
              resolve(file);
            }
          },
          'image/png',
          0.95,
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };
      img.src = objectUrl;
    });
  };

  const handleLogoUpload = async (file: File) => {
    setUploadingLogo(true);
    try {
      const resized = await resizeImage(file);
      const path = `logo-${Date.now()}-${resized.name}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(path, resized, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      const newUrl = data.publicUrl;

      const isFirstLogo = !settings.logo_url;
      const payload: Record<string, string> = { logo_url: newUrl };
      if (isFirstLogo) payload.default_logo_url = newUrl;

      await updateSettings(payload);
      showSnackbar('success', 'Logo updated.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Logo upload failed.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleLogoReset = async () => {
    const fallback = settings.default_logo_url;
    if (!fallback) {
      showSnackbar('warning', 'No default logo set yet. Upload one first.');
      return;
    }
    const ok = await showConfirmation({
      message: 'Reset the logo to the default?',
      title: 'Reset Logo',
      confirmText: 'Reset',
      confirmColor: 'warning',
      icon: <RestartAlt />,
    });
    if (!ok) return;
    try {
      await updateSettings({ logo_url: fallback });
      showSnackbar('success', 'Logo reset to default.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Reset failed.');
    }
  };

  const savingForm = saving;
  const logoUrl = settings.logo_url;

  const socials = useMemo(
    () =>
      [
        { key: 'instagram_url', label: 'Instagram', icon: <Instagram />, value: settings.instagram_url },
        { key: 'facebook_url', label: 'Facebook', icon: <Facebook />, value: settings.facebook_url },
        { key: 'youtube_url', label: 'YouTube', icon: <YouTube />, value: settings.youtube_url },
        { key: 'linkedin_url', label: 'LinkedIn', icon: <LinkedIn />, value: settings.linkedin_url },
      ].filter((s) => s.value),
    [settings],
  );

  const qc = useQueryClient();
  const contactsQuery = useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: fetchContacts,
    staleTime: 5 * 60 * 1000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error: e } = await supabase
        .from('contacts')
        .update({ is_read: true })
        .eq('id', id);
      if (e) throw e;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error: e } = await supabase.from('contacts').delete().eq('id', id);
      if (e) throw e;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CONTACTS_KEY }),
  });

  const openContact = (c: Contact) => {
    setViewingContact(c);
    if (!c.is_read) markReadMutation.mutate(c.id);
  };

  const handleDeleteContact = async (c: Contact) => {
    const ok = await showConfirmation({
      message: `Delete message from ${c.name}? This cannot be undone.`,
      title: 'Delete Message',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: <Delete />,
    });
    if (!ok) return;
    try {
      await deleteContactMutation.mutateAsync(c.id);
      showSnackbar('success', 'Message deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed.');
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
          <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.5rem' }}>
            Basic Details
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.875rem' }}>
            Manage logo, contact info, socials and site stats. These apply across the whole website.
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={methods.handleSubmit(onSubmit)}
          disabled={savingForm || loading}
          startIcon={
            savingForm ? <CircularProgress size={18} color="inherit" /> : <Save />
          }
          sx={{
            bgcolor: BRAND.primary,
            '&:hover': { bgcolor: BRAND.primaryDark },
            alignSelf: { xs: 'stretch', sm: 'center' },
          }}
        >
          {savingForm ? 'Saving…' : 'Save changes'}
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {String(error)}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 220 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {/* LOGO */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Logo
                </Typography>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={3}
                  sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
                >
                  <Box
                    sx={{
                      width: LOGO_MAX_WIDTH,
                      height: LOGO_MAX_HEIGHT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px dashed ${BRAND.light}`,
                      borderRadius: 2,
                      bgcolor: 'background.default',
                      overflow: 'hidden',
                      flexShrink: 0,
                    }}
                  >
                    {logoUrl ? (
                      <Box
                        component="img"
                        src={logoUrl}
                        alt="Logo"
                        sx={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        Image not uploaded
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={uploadingLogo}
                      startIcon={
                        uploadingLogo ? <CircularProgress size={18} /> : <CloudUpload />
                      }
                      sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
                    >
                      {uploadingLogo ? 'Uploading…' : 'Upload Logo'}
                      <input
                        type="file"
                        hidden
                        accept="image/png,image/jpeg,image/webp,image/svg+xml"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleLogoUpload(f);
                          e.target.value = '';
                        }}
                      />
                    </Button>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={handleLogoReset}
                      disabled={!settings.default_logo_url}
                      startIcon={<RestartAlt />}
                    >
                      Reset to Default
                    </Button>
                  </Stack>
                </Stack>
                <Typography sx={{ mt: 1.5, fontSize: '0.75rem', color: 'text.secondary' }}>
                  Max display size: {LOGO_MAX_WIDTH}×{LOGO_MAX_HEIGHT}px. Larger images are auto-resized.
                </Typography>
              </CardContent>
            </Card>

            {/* SITE INFO */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Site Info
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="site_name"
                      label="Site Name"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="gst_number"
                      label="GST Number"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="tagline"
                      label="Tagline"
                      inputType="all"
                      rows={2}
                      maxLength={200}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* CONTACT */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Contact Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MobileField name="phone_1" label="Primary Phone" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="phone_1_name"
                      label="Primary Contact Person"
                      inputType="alphabet"
                      maxLength={50}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="team_1_role"
                      label="Primary Person Role (shown on About)"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MobileField name="phone_2" label="Secondary Phone" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="phone_2_name"
                      label="Secondary Contact Person"
                      inputType="alphabet"
                      maxLength={50}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="team_2_role"
                      label="Secondary Person Role (shown on About)"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <EmailField name="email" label="Email Address" />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="address"
                      label="Address"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* WHATSAPP */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  WhatsApp
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MobileField name="whatsapp_1" label="Primary WhatsApp Number" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="whatsapp_1_name"
                      label="Primary WhatsApp Person"
                      inputType="alphabet"
                      maxLength={50}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <MobileField name="whatsapp_2" label="Secondary WhatsApp Number" />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="whatsapp_2_name"
                      label="Secondary WhatsApp Person"
                      inputType="alphabet"
                      maxLength={50}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* SOCIALS */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Social Media Links
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="instagram_url"
                      label="Instagram URL"
                      inputType="all"
                      maxLength={200}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="facebook_url"
                      label="Facebook URL"
                      inputType="all"
                      maxLength={200}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="youtube_url"
                      label="YouTube URL"
                      inputType="all"
                      maxLength={200}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="linkedin_url"
                      label="LinkedIn URL"
                      inputType="all"
                      maxLength={200}
                    />
                  </Grid>
                </Grid>
                {socials.length > 0 && (
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {socials.map((s) => (
                      <Chip
                        key={s.key}
                        icon={s.icon}
                        label={s.label}
                        size="small"
                        sx={{ bgcolor: 'action.hover', color: BRAND.primary }}
                      />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

            {/* STATS */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}>
                  Home Page Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextInputField
                      name="stat_installations"
                      label="Installations"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextInputField
                      name="stat_capacity"
                      label="Capacity"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextInputField
                      name="stat_experience"
                      label="Years Experience"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextInputField
                      name="stat_subsidy"
                      label="Max Subsidy"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </form>
        </FormProvider>
      )}

      {/* MESSAGES */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
          >
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <MailIcon sx={{ color: BRAND.primary }} />
              <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
                Contact Messages
              </Typography>
            </Stack>
            {contactsQuery.data && contactsQuery.data.filter((c) => !c.is_read).length > 0 && (
              <Chip
                size="small"
                label={`${contactsQuery.data.filter((c) => !c.is_read).length} new`}
                color="warning"
              />
            )}
          </Stack>

          <TableContainer component={Paper} sx={{ boxShadow: 'none', border: `1px solid ${BRAND.light}` }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactsQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <CircularProgress size={26} />
                    </TableCell>
                  </TableRow>
                ) : !contactsQuery.data || contactsQuery.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No messages yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  contactsQuery.data.map((c) => (
                    <TableRow key={c.id} sx={{ bgcolor: c.is_read ? 'inherit' : '#FFFBF0' }}>
                      <TableCell>
                        {c.is_read ? (
                          <Chip size="small" label="Read" />
                        ) : (
                          <Chip size="small" color="warning" label="New" />
                        )}
                      </TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.email}</TableCell>
                      <TableCell>{c.phone || '—'}</TableCell>
                      <TableCell>
                        {new Date(c.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => openContact(c)}
                          sx={{ color: BRAND.primary }}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteContact(c)}
                          sx={{ color: BRAND.error }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* CONTACT VIEW DIALOG */}
      <Dialog
        open={Boolean(viewingContact)}
        onClose={() => setViewingContact(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Message from {viewingContact?.name}
        </DialogTitle>
        <DialogContent dividers>
          <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }}>
            <Chip size="small" label={viewingContact?.email} />
            {viewingContact?.phone && <Chip size="small" label={viewingContact.phone} />}
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
            {viewingContact?.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setViewingContact(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}