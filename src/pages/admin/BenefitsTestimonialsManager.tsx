import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack,
  CircularProgress, Switch, FormControlLabel, Divider,
  Avatar, Rating,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon, CloudUpload } from '@mui/icons-material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useBenefits } from '@/hooks/useBenefits';
import { useTestimonials } from '@/hooks/useTestimonials';
import { BRAND } from '@/constants/Brand';
import type { SolarBenefit, Testimonial } from '@/types';
import { IconPicker } from '@/utils/IconMapping';
import TextInputField from '@/components/TextInputField';
import NumericField from '@/components/NumericField';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';

interface BenefitFormValues {
  title: string;
  description: string;
  icon: string;
  stat_value: string;
  stat_label: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY_BENEFIT: BenefitFormValues = {
  title: '',
  description: '',
  icon: 'savings',
  stat_value: '',
  stat_label: '',
  sort_order: '0',
  is_active: true,
};

interface TestimonialFormValues {
  name: string;
  location: string;
  rating: number;
  message: string;
  image_url: string;
  sort_order: string;
  is_active: boolean;
}

const EMPTY_TESTIMONIAL: TestimonialFormValues = {
  name: '',
  location: '',
  rating: 5,
  message: '',
  image_url: '',
  sort_order: '0',
  is_active: true,
};

export default function BenefitsTestimonialsManager() {
  const {
    benefits, loading: benefitsLoading,
    createBenefit, updateBenefit, deleteBenefit,
  } = useBenefits();
  const {
    testimonials, loading: testimonialsLoading,
    createTestimonial, updateTestimonial, deleteTestimonial,
    uploadTestimonialImage,
  } = useTestimonials();

  const [benefitOpen, setBenefitOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<SolarBenefit | null>(null);
  const benefitMethods = useForm<BenefitFormValues>({ defaultValues: EMPTY_BENEFIT });

  const [testimonialOpen, setTestimonialOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const testimonialMethods = useForm<TestimonialFormValues>({
    defaultValues: EMPTY_TESTIMONIAL,
  });

  const benefitIcon = useWatch({ control: benefitMethods.control, name: 'icon' });
  const benefitIsActive = useWatch({ control: benefitMethods.control, name: 'is_active' });
  const testimonialRating = useWatch({ control: testimonialMethods.control, name: 'rating' });
  const testimonialImageUrl = useWatch({ control: testimonialMethods.control, name: 'image_url' });
  const testimonialIsActive = useWatch({ control: testimonialMethods.control, name: 'is_active' });

  const handleAddBenefit = () => {
    setEditingBenefit(null);
    benefitMethods.reset(EMPTY_BENEFIT);
    setBenefitOpen(true);
  };

  const handleEditBenefit = (b: SolarBenefit) => {
    setEditingBenefit(b);
    benefitMethods.reset({
      title: b.title,
      description: b.description,
      icon: b.icon ?? 'savings',
      stat_value: b.stat_value ?? '',
      stat_label: b.stat_label ?? '',
      sort_order: String(b.sort_order ?? 0),
      is_active: b.is_active,
    });
    setBenefitOpen(true);
  };

  const handleDeleteBenefit = async (b: SolarBenefit) => {
    const ok = await showConfirmation({
      message: `Delete "${b.title}"? This action cannot be undone.`,
      title: 'Delete Benefit',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: <Delete />,
    });
    if (!ok) return;
    try {
      await deleteBenefit(b.id);
      showSnackbar('success', 'Benefit deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const onSubmitBenefit = async (values: BenefitFormValues) => {
    if (!values.title.trim() || !values.description.trim()) {
      showSnackbar('warning', 'Title and Description are required.');
      return;
    }
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        icon: values.icon || null,
        stat_value: values.stat_value.trim() || null,
        stat_label: values.stat_label.trim() || null,
        sort_order: parseInt(values.sort_order) || 0,
        is_active: values.is_active,
      };
      if (editingBenefit) {
        await updateBenefit({ id: editingBenefit.id, patch: payload });
        showSnackbar('success', 'Benefit updated.');
      } else {
        await createBenefit(payload);
        showSnackbar('success', 'Benefit added.');
      }
      setBenefitOpen(false);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    }
  };

  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    testimonialMethods.reset(EMPTY_TESTIMONIAL);
    setTestimonialOpen(true);
  };

  const handleEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    testimonialMethods.reset({
      name: t.name,
      location: t.location ?? '',
      rating: t.rating,
      message: t.message,
      image_url: t.image_url ?? '',
      sort_order: String(t.sort_order ?? 0),
      is_active: t.is_active,
    });
    setTestimonialOpen(true);
  };

  const handleDeleteTestimonial = async (t: Testimonial) => {
    const ok = await showConfirmation({
      message: `Delete testimonial from ${t.name}? This action cannot be undone.`,
      title: 'Delete Testimonial',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: <Delete />,
    });
    if (!ok) return;
    try {
      await deleteTestimonial(t.id);
      showSnackbar('success', 'Testimonial deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleTestimonialImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const url = await uploadTestimonialImage(file);
      testimonialMethods.setValue('image_url', url);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSubmitTestimonial = async (values: TestimonialFormValues) => {
    if (!values.name.trim() || !values.message.trim()) {
      showSnackbar('warning', 'Name and Message are required.');
      return;
    }
    try {
      const payload = {
        name: values.name.trim(),
        location: values.location.trim() || null,
        rating: values.rating,
        message: values.message.trim(),
        image_url: values.image_url || null,
        sort_order: parseInt(values.sort_order) || 0,
        is_active: values.is_active,
      };
      if (editingTestimonial) {
        await updateTestimonial({ id: editingTestimonial.id, patch: payload });
        showSnackbar('success', 'Testimonial updated.');
      } else {
        await createTestimonial(payload);
        showSnackbar('success', 'Testimonial added.');
      }
      setTestimonialOpen(false);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    }
  };

  const savingBenefit = benefitMethods.formState.isSubmitting;
  const savingTestimonial = testimonialMethods.formState.isSubmitting;

  return (
    <Box>
      {/* ============ SECTION 1 — BENEFITS ============ */}
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
          <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.5rem' }}>
            Benefits
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.875rem' }}>
            "Why Go Solar" cards shown on the Home page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddBenefit}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Benefit
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)', mb: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Stat</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Icon</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {benefitsLoading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ color: BRAND.primary }} />
                </TableCell>
              </TableRow>
            ) : benefits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No benefits yet. Click "Add Benefit" to start.
                </TableCell>
              </TableRow>
            ) : (
              benefits.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.sort_order}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: 'text.primary' }}>
                      {b.title}
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                      {b.description.slice(0, 60)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {b.stat_value ? (
                      <Chip
                        size="small"
                        label={`${b.stat_value} ${b.stat_label ?? ''}`}
                        sx={{ bgcolor: `${BRAND.success}15`, color: BRAND.success, fontWeight: 700 }}
                      />
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={b.icon || '—'}
                      sx={{ bgcolor: 'action.hover', color: BRAND.primary }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={b.is_active ? 'Active' : 'Hidden'}
                      color={b.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditBenefit(b)}
                      sx={{ color: BRAND.primary }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteBenefit(b)}
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

      <Divider sx={{ mb: 4 }} />

      {/* ============ SECTION 2 — TESTIMONIALS ============ */}
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
          <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.5rem' }}>
            Testimonials
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 0.5, fontSize: '0.875rem' }}>
            Customer reviews shown on the Home page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTestimonial}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Testimonial
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testimonialsLoading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ color: BRAND.primary }} />
                </TableCell>
              </TableRow>
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No testimonials yet. Click "Add Testimonial" to start.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Avatar
                        src={t.image_url || undefined}
                        sx={{ bgcolor: BRAND.primary, width: 36, height: 36 }}
                      >
                        {t.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.9rem' }}
                        >
                          {t.name}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          {t.location || '—'}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Rating value={t.rating} readOnly size="small" sx={{ color: BRAND.accent }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {t.message.slice(0, 80)}
                      {t.message.length > 80 ? '...' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={t.is_active ? 'Active' : 'Hidden'}
                      color={t.is_active ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditTestimonial(t)}
                      sx={{ color: BRAND.primary }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteTestimonial(t)}
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

      {/* ============ BENEFIT DIALOG ============ */}
      <Dialog open={benefitOpen} onClose={() => setBenefitOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {editingBenefit ? 'Edit Benefit' : 'Add Benefit'}
          <IconButton onClick={() => setBenefitOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <FormProvider {...benefitMethods}>
          <form onSubmit={benefitMethods.handleSubmit(onSubmitBenefit)}>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <TextInputField
                  name="title"
                  label="Title"
                  required
                  inputType="all"
                  maxLength={80}
                />
                <TextInputField
                  name="description"
                  label="Description"
                  required
                  inputType="all"
                  rows={3}
                  maxLength={300}
                />
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="stat_value"
                      label="Stat Value"
                      inputType="all"
                      maxLength={20}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="stat_label"
                      label="Stat Label"
                      inputType="all"
                      maxLength={40}
                    />
                  </Grid>
                </Grid>
                <IconPicker
                  value={benefitIcon ?? 'savings'}
                  onChange={(icon) => benefitMethods.setValue('icon', icon)}
                />
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
                      checked={Boolean(benefitIsActive)}
                      onChange={(e) => benefitMethods.setValue('is_active', e.target.checked)}
                      sx={{ '&.Mui-checked': { color: BRAND.success } }}
                    />
                  }
                  label="Active"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setBenefitOpen(false)} disabled={savingBenefit}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingBenefit}
                startIcon={
                  savingBenefit ? <CircularProgress size={18} color="inherit" /> : undefined
                }
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {savingBenefit ? 'Saving…' : editingBenefit ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      {/* ============ TESTIMONIAL DIALOG ============ */}
      <Dialog
        open={testimonialOpen}
        onClose={() => setTestimonialOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
          <IconButton onClick={() => setTestimonialOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <FormProvider {...testimonialMethods}>
          <form onSubmit={testimonialMethods.handleSubmit(onSubmitTestimonial)}>
            <DialogContent dividers>
              <Stack spacing={2.5} sx={{ mt: 1 }}>
                <TextInputField
                  name="name"
                  label="Customer Name"
                  required
                  inputType="alphabet"
                  minLength={2}
                  maxLength={60}
                />
                <TextInputField
                  name="location"
                  label="Location"
                  inputType="alphabet"
                  maxLength={60}
                />
                <Box>
                  <Typography
                    sx={{
                      mb: 0.5,
                      fontWeight: 600,
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                    }}
                  >
                    Rating
                  </Typography>
                  <Rating
                    value={testimonialRating ?? 5}
                    onChange={(_, v) => testimonialMethods.setValue('rating', v || 5)}
                    sx={{ color: BRAND.accent }}
                  />
                </Box>
                <TextInputField
                  name="message"
                  label="Message"
                  required
                  inputType="all"
                  rows={4}
                  maxLength={500}
                />
                <Box>
                  <Button
                    variant="outlined"
                    component="label"
                    disabled={uploadingImage}
                    sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
                    startIcon={
                      uploadingImage ? <CircularProgress size={18} /> : <CloudUpload />
                    }
                  >
                    {uploadingImage ? 'Uploading…' : 'Upload Photo (optional)'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleTestimonialImage(f);
                        e.target.value = '';
                      }}
                    />
                  </Button>
                  {testimonialImageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <Avatar src={testimonialImageUrl} sx={{ width: 60, height: 60 }} />
                    </Box>
                  )}
                  {!testimonialImageUrl && (
                    <Typography sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
                      Image not uploaded
                    </Typography>
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
                      checked={Boolean(testimonialIsActive)}
                      onChange={(e) =>
                        testimonialMethods.setValue('is_active', e.target.checked)
                      }
                      sx={{ '&.Mui-checked': { color: BRAND.success } }}
                    />
                  }
                  label="Active (visible on website)"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setTestimonialOpen(false)} disabled={savingTestimonial}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingTestimonial || uploadingImage}
                startIcon={
                  savingTestimonial ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : undefined
                }
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {savingTestimonial ? 'Saving…' : editingTestimonial ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
}