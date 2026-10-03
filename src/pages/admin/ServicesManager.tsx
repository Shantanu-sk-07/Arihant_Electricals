import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack,
  CircularProgress, Switch, FormControlLabel, Card, CardContent, Divider,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon, Save, CloudUpload } from '@mui/icons-material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useServices } from '@/hooks/useServices';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/constants/Brand';
import type { Service } from '@/types';
import { IconPicker } from '@/utils/IconMapping';
import TextInputField from '@/components/TextInputField';
import NumericField from '@/components/NumericField';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';

interface ServiceFormValues {
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  image_url: string;
  features: string;
  sort_order: string;
  is_active: boolean;
}

interface PageCopyValues {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;
}

const EMPTY_SERVICE: ServiceFormValues = {
  title: '',
  short_description: '',
  full_description: '',
  icon: 'solar_power',
  image_url: '',
  features: '',
  sort_order: '0',
  is_active: true,
};

export default function ServicesManager() {
  const {
    services, loading, createService, updateService, deleteService, uploadServiceImage,
  } = useServices();
  const { content, loading: contentLoading, updateContents } = useContent('services');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingCopy, setSavingCopy] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const serviceMethods = useForm<ServiceFormValues>({ defaultValues: EMPTY_SERVICE });
  const copyMethods = useForm<PageCopyValues>({
    defaultValues: {
      hero_title: '',
      hero_subtitle: '',
      hero_image: '',
      cta_title: '',
      cta_subtitle: '',
      cta_button: '',
    },
  });

  const heroImage = useWatch({ control: copyMethods.control, name: 'hero_image' });
  const serviceIcon = useWatch({ control: serviceMethods.control, name: 'icon' });
  const serviceIsActive = useWatch({ control: serviceMethods.control, name: 'is_active' });
  const serviceImageUrl = useWatch({ control: serviceMethods.control, name: 'image_url' });

  useEffect(() => {
    // Guard: only reset when content actually has data.
    // Prevents infinite loop when API fails (403) and content stays empty.
    if (Object.keys(content).length === 0) return;

    copyMethods.reset({
      hero_title: content['hero.title'] ?? '',
      hero_subtitle: content['hero.subtitle'] ?? '',
      hero_image: content['hero.image'] ?? '',
      cta_title: content['cta.title'] ?? '',
      cta_subtitle: content['cta.subtitle'] ?? '',
      cta_button: content['cta.button'] ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleAdd = () => {
    setEditing(null);
    serviceMethods.reset(EMPTY_SERVICE);
    setOpen(true);
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    serviceMethods.reset({
      title: s.title,
      short_description: s.short_description ?? '',
      full_description: s.full_description ?? '',
      icon: s.icon ?? 'solar_power',
      image_url: s.image_url ?? '',
      features: (s.features ?? []).join('\n'),
      sort_order: String(s.sort_order ?? 0),
      is_active: s.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (s: Service) => {
    const ok = await showConfirmation({
      message: `Delete "${s.title}"? This action cannot be undone.`,
      title: 'Delete Service',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: '🗑️',
    });
    if (!ok) return;
    try {
      await deleteService(s.id);
      showSnackbar('success', 'Service deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleServiceImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadServiceImage(file);
      serviceMethods.setValue('image_url', url);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImage = async (file: File) => {
    setUploadingHero(true);
    try {
      const path = `page-heroes/services-${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('media').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      copyMethods.setValue('hero_image', data.publicUrl);
      showSnackbar('success', 'Hero image uploaded. Save to publish.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const onSubmitService = async (values: ServiceFormValues) => {
    if (!values.title.trim()) {
      showSnackbar('warning', 'Title is required.');
      return;
    }
    try {
      const payload = {
        title: values.title.trim(),
        short_description: values.short_description.trim() || null,
        full_description: values.full_description.trim() || null,
        icon: values.icon || null,
        image_url: values.image_url || null,
        features: values.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        sort_order: parseInt(values.sort_order) || 0,
        is_active: values.is_active,
      };
      if (editing) {
        await updateService({ id: editing.id, patch: payload });
        showSnackbar('success', 'Service updated.');
      } else {
        await createService(payload);
        showSnackbar('success', 'Service added.');
      }
      setOpen(false);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    }
  };

  const onSubmitCopy = async (values: PageCopyValues) => {
    const mapped: Record<string, string> = {
      'hero.title': values.hero_title,
      'hero.subtitle': values.hero_subtitle,
      'hero.image': values.hero_image,
      'cta.title': values.cta_title,
      'cta.subtitle': values.cta_subtitle,
      'cta.button': values.cta_button,
    };
    setSavingCopy(true);
    try {
      await updateContents(mapped);
      showSnackbar('success', 'Services page copy saved.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingCopy(false);
    }
  };

  const savingService = serviceMethods.formState.isSubmitting;

  return (
    <Box>
      {/* SECTION 1 — SERVICES LIST */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, color: BRAND.dark, fontSize: '1.5rem' }}>
            Services
          </Typography>
          <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
            These cards appear on the Home and Services pages.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Service
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)', mb: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: BRAND.light }}>
              <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Icon</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Features</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ color: BRAND.primary }} />
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                  No services yet. Click "Add Service" to start.
                </TableCell>
              </TableRow>
            ) : (
              services.map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.sort_order}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: BRAND.dark }}>
                      {s.title}
                    </Typography>
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                      {s.short_description?.slice(0, 60) || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={s.icon || '—'}
                      sx={{ bgcolor: BRAND.light, color: BRAND.primary, fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={`${s.features?.length ?? 0} items`} />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={s.is_active ? 'Active' : 'Hidden'}
                      color={s.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(s)} sx={{ color: BRAND.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(s)} sx={{ color: BRAND.error }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Divider sx={{ mb: 4 }} />

      {/* SECTION 2 — SERVICES PAGE COPY */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.dark, fontSize: '1.5rem' }}>
          Services Page Copy
        </Typography>
        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
          Hero banner and call-to-action text shown on the Services page.
        </Typography>
      </Box>

      {contentLoading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      ) : (
        <FormProvider {...copyMethods}>
          <form onSubmit={copyMethods.handleSubmit(onSubmitCopy)}>
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                  Hero Banner
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="hero_title"
                      label="Hero Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="hero_subtitle"
                      label="Hero Subtitle"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Stack spacing={1.5}>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary' }}
                      >
                        Hero Background Image
                      </Typography>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Button
                          variant="outlined"
                          component="label"
                          disabled={uploadingHero}
                          startIcon={
                            uploadingHero ? <CircularProgress size={18} /> : <CloudUpload />
                          }
                          sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
                        >
                          {uploadingHero ? 'Uploading…' : 'Upload Image'}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleHeroImage(f);
                              e.target.value = '';
                            }}
                          />
                        </Button>
                        {heroImage && (
                          <Box
                            component="img"
                            src={heroImage}
                            alt="Hero preview"
                            sx={{
                              width: 120,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: `1px solid ${BRAND.light}`,
                            }}
                          />
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                  Bottom Call-to-Action
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="cta_title"
                      label="CTA Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="cta_button"
                      label="CTA Button Label"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="cta_subtitle"
                      label="CTA Subtitle"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Button
              type="submit"
              variant="contained"
              disabled={savingCopy}
              startIcon={
                savingCopy ? <CircularProgress size={18} color="inherit" /> : <Save />
              }
              sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
            >
              {savingCopy ? 'Saving…' : 'Save Page Copy'}
            </Button>
          </form>
        </FormProvider>
      )}

      {/* SERVICE DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {editing ? 'Edit Service' : 'Add Service'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <FormProvider {...serviceMethods}>
          <form onSubmit={serviceMethods.handleSubmit(onSubmitService)}>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <TextInputField
                  name="title"
                  label="Title"
                  required
                  inputType="all"
                  maxLength={100}
                />
                <TextInputField
                  name="short_description"
                  label="Short Description"
                  inputType="all"
                  rows={2}
                  maxLength={200}
                />
                <TextInputField
                  name="full_description"
                  label="Full Description"
                  inputType="all"
                  rows={4}
                />
                <IconPicker
                  value={serviceIcon ?? 'solar_power'}
                  onChange={(icon) => serviceMethods.setValue('icon', icon)}
                />
                <TextInputField
                  name="features"
                  label="Features (one per line)"
                  inputType="all"
                  rows={5}
                />
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploading}
                    sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
                    startIcon={uploading ? <CircularProgress size={18} /> : undefined}
                  >
                    {uploading ? 'Uploading…' : 'Upload Image (optional)'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleServiceImage(f);
                        e.target.value = '';
                      }}
                    />
                  </Button>
                  {serviceImageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Box
                        component="img"
                        src={serviceImageUrl}
                        alt="preview"
                        sx={{
                          maxWidth: 200,
                          maxHeight: 120,
                          borderRadius: 2,
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                  )}
                </Box>
                <NumericField
                  name="sort_order"
                  label="Sort Order"
                  min={0}
                  max={9999}
                  maxlength={4}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={Boolean(serviceIsActive)}
                      onChange={(e) => serviceMethods.setValue('is_active', e.target.checked)}
                      sx={{ '&.Mui-checked': { color: BRAND.success } }}
                    />
                  }
                  label="Active (visible on website)"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpen(false)} disabled={savingService}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingService || uploading}
                startIcon={
                  savingService ? <CircularProgress size={18} color="inherit" /> : undefined
                }
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {savingService ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
}