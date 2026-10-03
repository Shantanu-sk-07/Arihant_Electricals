import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack,
  CircularProgress, Switch, FormControlLabel, Card, CardContent, Divider,
} from '@mui/material';
import {
  Edit, Delete, Add, Close as CloseIcon, Save, CloudUpload,
} from '@mui/icons-material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { usePricing } from '@/hooks/usePricing';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/constants/Brand';
import type { PricingPlan } from '@/types';
import TextInputField from '@/components/TextInputField';
import NumericField from '@/components/NumericField';
import DropdownField from '@/components/DropdownField';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';

interface PlanFormValues {
  kw: string;
  system_type: string;
  total_cost: string;
  subsidy_amount: string;
  final_cost: string;
  monthly_savings: string;
  panels_count: string;
  area_required: string;
  is_popular: boolean;
  sort_order: string;
  is_active: boolean;
}

interface PageCopyValues {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  calculator_title: string;
  calculator_subtitle: string;
  plans_eyebrow: string;
  plans_title: string;
  plans_subtitle: string;
  subsidy_eyebrow: string;
  subsidy_title: string;
  subsidy_subtitle: string;
  cta_title: string;
  cta_subtitle: string;
  cta_button: string;
}

const EMPTY_PLAN: PlanFormValues = {
  kw: '1',
  system_type: 'on-grid',
  total_cost: '0',
  subsidy_amount: '0',
  final_cost: '0',
  monthly_savings: '0',
  panels_count: '0',
  area_required: '',
  is_popular: false,
  sort_order: '0',
  is_active: true,
};

const SYSTEM_TYPE_OPTIONS = [
  { label: 'On-Grid', value: 'on-grid' },
  { label: 'Off-Grid', value: 'off-grid' },
  { label: 'Hybrid', value: 'hybrid' },
];

export default function PricingManager() {
  const { plans, loading, createPlan, updatePlan, deletePlan } = usePricing();
  const { content, loading: contentLoading, updateContents } = useContent('pricing');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [savingCopy, setSavingCopy] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const planMethods = useForm<PlanFormValues>({ defaultValues: EMPTY_PLAN });
  const copyMethods = useForm<PageCopyValues>({
    defaultValues: {
      hero_title: '',
      hero_subtitle: '',
      hero_image: '',
      calculator_title: '',
      calculator_subtitle: '',
      plans_eyebrow: '',
      plans_title: '',
      plans_subtitle: '',
      subsidy_eyebrow: '',
      subsidy_title: '',
      subsidy_subtitle: '',
      cta_title: '',
      cta_subtitle: '',
      cta_button: '',
    },
  });

  const heroImage = useWatch({ control: copyMethods.control, name: 'hero_image' });
  const isPopular = useWatch({ control: planMethods.control, name: 'is_popular' });
  const isActive = useWatch({ control: planMethods.control, name: 'is_active' });

  useEffect(() => {
    // Guard: only reset when content actually has data.
    // Prevents infinite loop when API fails (403) and content stays empty.
    if (Object.keys(content).length === 0) return;

    copyMethods.reset({
      hero_title: content['hero.title'] ?? '',
      hero_subtitle: content['hero.subtitle'] ?? '',
      hero_image: content['hero.image'] ?? '',
      calculator_title: content['calculator.title'] ?? '',
      calculator_subtitle: content['calculator.subtitle'] ?? '',
      plans_eyebrow: content['plans.eyebrow'] ?? '',
      plans_title: content['plans.title'] ?? '',
      plans_subtitle: content['plans.subtitle'] ?? '',
      subsidy_eyebrow: content['subsidy.eyebrow'] ?? '',
      subsidy_title: content['subsidy.title'] ?? '',
      subsidy_subtitle: content['subsidy.subtitle'] ?? '',
      cta_title: content['cta.title'] ?? '',
      cta_subtitle: content['cta.subtitle'] ?? '',
      cta_button: content['cta.button'] ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleAdd = () => {
    setEditing(null);
    planMethods.reset(EMPTY_PLAN);
    setOpen(true);
  };

  const handleEdit = (p: PricingPlan) => {
    setEditing(p);
    planMethods.reset({
      kw: String(p.kw),
      system_type: p.system_type ?? 'on-grid',
      total_cost: String(p.total_cost),
      subsidy_amount: String(p.subsidy_amount),
      final_cost: String(p.final_cost),
      monthly_savings: String(p.monthly_savings ?? 0),
      panels_count: String(p.panels_count ?? 0),
      area_required: p.area_required ?? '',
      is_popular: p.is_popular,
      sort_order: String(p.sort_order ?? 0),
      is_active: p.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (p: PricingPlan) => {
    const ok = await showConfirmation({
      message: `Delete ${p.kw} KW plan? This action cannot be undone.`,
      title: 'Delete Pricing Plan',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: '🗑️',
    });
    if (!ok) return;
    try {
      await deletePlan(p.id);
      showSnackbar('success', 'Pricing plan deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleHeroImage = async (file: File) => {
    setUploadingHero(true);
    try {
      const path = `page-heroes/pricing-${Date.now()}-${file.name}`;
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

  const onSubmitPlan = async (values: PlanFormValues) => {
    const kw = parseFloat(values.kw) || 0;
    if (kw <= 0) {
      showSnackbar('warning', 'KW must be greater than 0.');
      return;
    }
    try {
      const total = parseFloat(values.total_cost) || 0;
      const subsidy = parseFloat(values.subsidy_amount) || 0;
      const finalCost = parseFloat(values.final_cost) || total - subsidy;
      const payload = {
        kw,
        system_type: values.system_type || 'on-grid',
        total_cost: total,
        subsidy_amount: subsidy,
        final_cost: finalCost,
        monthly_savings: parseFloat(values.monthly_savings) || null,
        panels_count: parseInt(values.panels_count) || null,
        area_required: values.area_required.trim() || null,
        is_popular: values.is_popular,
        sort_order: parseInt(values.sort_order) || 0,
        is_active: values.is_active,
      };
      if (editing) {
        await updatePlan({ id: editing.id, patch: payload });
        showSnackbar('success', 'Pricing plan updated.');
      } else {
        await createPlan(payload);
        showSnackbar('success', 'Pricing plan added.');
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
      'calculator.title': values.calculator_title,
      'calculator.subtitle': values.calculator_subtitle,
      'plans.eyebrow': values.plans_eyebrow,
      'plans.title': values.plans_title,
      'plans.subtitle': values.plans_subtitle,
      'subsidy.eyebrow': values.subsidy_eyebrow,
      'subsidy.title': values.subsidy_title,
      'subsidy.subtitle': values.subsidy_subtitle,
      'cta.title': values.cta_title,
      'cta.subtitle': values.cta_subtitle,
      'cta.button': values.cta_button,
    };
    setSavingCopy(true);
    try {
      await updateContents(mapped);
      showSnackbar('success', 'Pricing page copy saved.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingCopy(false);
    }
  };

  const savingPlan = planMethods.formState.isSubmitting;
  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

  return (
    <Box>
      {/* SECTION 1 — PRICING PLANS */}
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
            Pricing Plans
          </Typography>
          <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
            These plans show on Home and Pricing pages.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Plan
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)', mb: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: BRAND.light }}>
              <TableCell sx={{ fontWeight: 700 }}>KW</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Subsidy</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Final Cost</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Monthly Saving</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ color: BRAND.primary }} />
                </TableCell>
              </TableRow>
            ) : plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                  No pricing plans yet. Click "Add Plan" to start.
                </TableCell>
              </TableRow>
            ) : (
              plans.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 700, color: BRAND.dark }}>
                      {p.kw} KW
                    </Typography>
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                      {p.system_type?.toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatINR(p.total_cost)}</TableCell>
                  <TableCell sx={{ color: BRAND.success, fontWeight: 600 }}>
                    {formatINR(p.subsidy_amount)}
                  </TableCell>
                  <TableCell sx={{ color: BRAND.primary, fontWeight: 700 }}>
                    {formatINR(p.final_cost)}
                  </TableCell>
                  <TableCell>
                    {p.monthly_savings ? formatINR(p.monthly_savings) : '—'}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Chip
                        size="small"
                        label={p.is_active ? 'Active' : 'Hidden'}
                        color={p.is_active ? 'success' : 'default'}
                      />
                      {p.is_popular && (
                        <Chip
                          size="small"
                          label="Popular"
                          sx={{ bgcolor: BRAND.accent, color: BRAND.dark, fontWeight: 700 }}
                        />
                      )}
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(p)} sx={{ color: BRAND.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(p)} sx={{ color: BRAND.error }}>
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

      {/* SECTION 2 — PRICING PAGE COPY */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.dark, fontSize: '1.5rem' }}>
          Pricing Page Copy
        </Typography>
        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
          Hero banner, calculator, plans section, subsidy section and CTA text.
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
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                        }}
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
                  Savings Calculator
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextInputField
                      name="calculator_title"
                      label="Calculator Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="calculator_subtitle"
                      label="Calculator Subtitle"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                  Plans Section Heading
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextInputField
                      name="plans_eyebrow"
                      label="Eyebrow"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextInputField
                      name="plans_title"
                      label="Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="plans_subtitle"
                      label="Subtitle"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                  Subsidy Section
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextInputField
                      name="subsidy_eyebrow"
                      label="Eyebrow"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextInputField
                      name="subsidy_title"
                      label="Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="subsidy_subtitle"
                      label="Subtitle"
                      inputType="all"
                      rows={2}
                      maxLength={300}
                    />
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
              startIcon={savingCopy ? <CircularProgress size={18} color="inherit" /> : <Save />}
              sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
            >
              {savingCopy ? 'Saving…' : 'Save Page Copy'}
            </Button>
          </form>
        </FormProvider>
      )}

      {/* PLAN DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {editing ? 'Edit Plan' : 'Add Plan'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <FormProvider {...planMethods}>
          <form onSubmit={planMethods.handleSubmit(onSubmitPlan)}>
            <DialogContent dividers>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="kw"
                    label="System Size (KW)"
                    required
                    min={1}
                    max={1000}
                    decimal
                    decimalDigits={2}
                    maxlength={6}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <DropdownField
                    name="system_type"
                    label="System Type"
                    options={SYSTEM_TYPE_OPTIONS}
                    required
                    editable={false}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="sort_order"
                    label="Sort Order"
                    min={0}
                    max={9999}
                    maxlength={4}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="total_cost"
                    label="Total Cost (₹)"
                    min={0}
                    max={99999999}
                    maxlength={10}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="subsidy_amount"
                    label="Subsidy Amount (₹)"
                    min={0}
                    max={9999999}
                    maxlength={8}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="final_cost"
                    label="Final Cost (₹)"
                    min={0}
                    max={99999999}
                    maxlength={10}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="monthly_savings"
                    label="Monthly Savings (₹)"
                    min={0}
                    max={9999999}
                    maxlength={8}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <NumericField
                    name="panels_count"
                    label="Panels Count"
                    min={0}
                    max={9999}
                    maxlength={4}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextInputField
                    name="area_required"
                    label="Area Required"
                    inputType="all"
                    maxLength={50}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Stack direction="row" spacing={3}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(isPopular)}
                          onChange={(e) => planMethods.setValue('is_popular', e.target.checked)}
                          sx={{ '&.Mui-checked': { color: BRAND.accent } }}
                        />
                      }
                      label="Mark as Popular"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(isActive)}
                          onChange={(e) => planMethods.setValue('is_active', e.target.checked)}
                          sx={{ '&.Mui-checked': { color: BRAND.success } }}
                        />
                      }
                      label="Active (visible on website)"
                    />
                  </Stack>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpen(false)} disabled={savingPlan}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingPlan}
                startIcon={
                  savingPlan ? <CircularProgress size={18} color="inherit" /> : undefined
                }
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {savingPlan ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
}