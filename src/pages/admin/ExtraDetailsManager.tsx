import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Grid, Stack, Card, CardContent,
  CircularProgress, Tab, Tabs, Alert,
} from '@mui/material';
import { Save, CloudUpload } from '@mui/icons-material';
import {
  FormProvider, useForm, useWatch, type UseFormReturn,
} from 'react-hook-form';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/constants/Brand';
import TextInputField from '@/components/TextInputField';
import { showSnackbar } from '@/components/ToastMessage';

type PageId = 'home' | 'about' | 'contact';

interface FormValues {
  home_hero_kicker: string;
  home_hero_title: string;
  home_hero_subtitle: string;
  home_hero_cta: string;
  home_hero_secondary_cta: string;
  home_hero_caption: string;
  home_hero_image: string;
  home_stats_installation_label: string;
  home_stats_capacity_label: string;
  home_stats_experience_label: string;
  home_stats_subsidy_label: string;
  home_intro_eyebrow: string;
  home_intro_title: string;
  home_intro_body: string;
  home_intro_image: string;
  home_intro_caption_title: string;
  home_intro_caption_subtitle: string;
  home_services_eyebrow: string;
  home_services_title: string;
  home_services_subtitle: string;
  home_steps_eyebrow: string;
  home_steps_title: string;
  home_steps_subtitle: string;
  home_step1_title: string;
  home_step1_description: string;
  home_step2_title: string;
  home_step2_description: string;
  home_step3_title: string;
  home_step3_description: string;
  home_step4_title: string;
  home_step4_description: string;
  home_pricing_eyebrow: string;
  home_pricing_title: string;
  home_pricing_subtitle: string;
  home_testimonials_eyebrow: string;
  home_testimonials_title: string;
  home_testimonials_subtitle: string;
  home_cta_eyebrow: string;
  home_cta_title: string;
  home_cta_subtitle: string;
  home_cta_image: string;
  about_hero_title: string;
  about_hero_subtitle: string;
  about_hero_image: string;
  about_story_eyebrow: string;
  about_story_title: string;
  about_intro_body: string;
  about_story_supporting_body: string;
  about_story_image: string;
  about_purpose_eyebrow: string;
  about_purpose_title: string;
  about_purpose_subtitle: string;
  about_mission_title: string;
  about_mission_body: string;
  about_vision_title: string;
  about_vision_body: string;
  about_why_title: string;
  about_why_items: string;
  about_team_eyebrow: string;
  about_team_title: string;
  about_team_subtitle: string;
  about_certifications_eyebrow: string;
  about_certifications_title: string;
  contact_hero_title: string;
  contact_hero_subtitle: string;
  contact_hero_image: string;
  contact_form_eyebrow: string;
  contact_form_title: string;
  contact_form_success_message: string;
}

const EMPTY: FormValues = {
  home_hero_kicker: '',
  home_hero_title: '',
  home_hero_subtitle: '',
  home_hero_cta: '',
  home_hero_secondary_cta: '',
  home_hero_caption: '',
  home_hero_image: '',
  home_stats_installation_label: '',
  home_stats_capacity_label: '',
  home_stats_experience_label: '',
  home_stats_subsidy_label: '',
  home_intro_eyebrow: '',
  home_intro_title: '',
  home_intro_body: '',
  home_intro_image: '',
  home_intro_caption_title: '',
  home_intro_caption_subtitle: '',
  home_services_eyebrow: '',
  home_services_title: '',
  home_services_subtitle: '',
  home_steps_eyebrow: '',
  home_steps_title: '',
  home_steps_subtitle: '',
  home_step1_title: '',
  home_step1_description: '',
  home_step2_title: '',
  home_step2_description: '',
  home_step3_title: '',
  home_step3_description: '',
  home_step4_title: '',
  home_step4_description: '',
  home_pricing_eyebrow: '',
  home_pricing_title: '',
  home_pricing_subtitle: '',
  home_testimonials_eyebrow: '',
  home_testimonials_title: '',
  home_testimonials_subtitle: '',
  home_cta_eyebrow: '',
  home_cta_title: '',
  home_cta_subtitle: '',
  home_cta_image: '',
  about_hero_title: '',
  about_hero_subtitle: '',
  about_hero_image: '',
  about_story_eyebrow: '',
  about_story_title: '',
  about_intro_body: '',
  about_story_supporting_body: '',
  about_story_image: '',
  about_purpose_eyebrow: '',
  about_purpose_title: '',
  about_purpose_subtitle: '',
  about_mission_title: '',
  about_mission_body: '',
  about_vision_title: '',
  about_vision_body: '',
  about_why_title: '',
  about_why_items: '',
  about_team_eyebrow: '',
  about_team_title: '',
  about_team_subtitle: '',
  about_certifications_eyebrow: '',
  about_certifications_title: '',
  contact_hero_title: '',
  contact_hero_subtitle: '',
  contact_hero_image: '',
  contact_form_eyebrow: '',
  contact_form_title: '',
  contact_form_success_message: '',
};

const PAGE_KEYS: Record<PageId, string[]> = {
  home: [
    'hero.kicker', 'hero.title', 'hero.subtitle', 'hero.cta',
    'hero.secondary_cta', 'hero.caption', 'hero.image',
    'stats.installation_label', 'stats.capacity_label',
    'stats.experience_label', 'stats.subsidy_label',
    'intro.eyebrow', 'intro.title', 'intro.body', 'intro.image',
    'intro.image_caption_title', 'intro.image_caption_subtitle',
    'services.eyebrow', 'services.title', 'services.subtitle',
    'steps.eyebrow', 'steps.title', 'steps.subtitle',
    'steps.step1.title', 'steps.step1.description',
    'steps.step2.title', 'steps.step2.description',
    'steps.step3.title', 'steps.step3.description',
    'steps.step4.title', 'steps.step4.description',
    'pricing.eyebrow', 'pricing.title', 'pricing.subtitle',
    'testimonials.eyebrow', 'testimonials.title', 'testimonials.subtitle',
    'cta.eyebrow', 'cta.title', 'cta.subtitle', 'cta.image',
  ],
  about: [
    'hero.title', 'hero.subtitle', 'hero.image',
    'story.eyebrow', 'story.title', 'story.supporting_body', 'story.image',
    'intro.body',
    'purpose.eyebrow', 'purpose.title', 'purpose.subtitle',
    'mission.title', 'mission.body',
    'vision.title', 'vision.body',
    'why.title', 'why.items',
    'team.eyebrow', 'team.title', 'team.subtitle',
    'certifications.eyebrow', 'certifications.title',
  ],
  contact: [
    'hero.title', 'hero.subtitle', 'hero.image',
    'form.eyebrow', 'form.title', 'form.success_message',
  ],
};

/* ---------------- OUTSIDE COMPONENTS ---------------- */

interface TextRowProps {
  methods: UseFormReturn<FormValues>;
  name: keyof FormValues;
  label: string;
  rows?: number;
  max?: number;
}

function TextRow({ name, label, rows, max = 200 }: TextRowProps) {
  return (
    <TextInputField
      name={name}
      label={label}
      inputType="all"
      rows={rows ?? 2}
      maxLength={max}
    />
  );
}

interface ImageRowProps {
  methods: UseFormReturn<FormValues>;
  name: keyof FormValues;
  label: string;
  uploadingKey: string | null;
  onUpload: (formKey: string, file: File) => void;
}

function ImageRow({ methods, name, label, uploadingKey, onUpload }: ImageRowProps) {
  const value = useWatch({ control: methods.control, name }) as string | undefined;
  return (
    <Stack spacing={1.5}>
      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.secondary' }}>
        {label}
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
        <Button
          variant="outlined"
          component="label"
          disabled={Boolean(uploadingKey)}
          startIcon={uploadingKey === name ? <CircularProgress size={18} /> : <CloudUpload />}
          sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
        >
          {uploadingKey === name ? 'Uploading…' : 'Upload Image'}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(String(name), f);
              e.target.value = '';
            }}
          />
        </Button>
        {value && (
          <Box
            component="img"
            src={value}
            alt={label}
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
  );
}

/* ---------------- MAIN ---------------- */

export default function ExtraDetailsManager() {
  const [page, setPage] = useState<PageId>('home');
  const { content, loading, error, updateContents } = useContent(page);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const methods = useForm<FormValues>({ defaultValues: EMPTY });
  const prefix = page;

  const buildFormKey = (sectionKey: string) =>
    `${prefix}_${sectionKey.replace('.', '_')}`;

  useEffect(() => {
    // Guard: only reset when content actually has data.
    // Prevents infinite loop when API fails (403) and content stays empty.
    if (Object.keys(content).length === 0) return;

    const mapped: Record<string, string> = {};
    PAGE_KEYS[page].forEach((key) => {
      mapped[buildFormKey(key)] = content[key] ?? '';
    });
    methods.reset({ ...EMPTY, ...mapped });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, page]);

  const onSubmit = async (values: FormValues) => {
    const mapped: Record<string, string> = {};
    PAGE_KEYS[page].forEach((sectionKey) => {
      const formKey = buildFormKey(sectionKey);
      const formValue = values[formKey as keyof FormValues] ?? '';
      const currentValue = content[sectionKey] ?? '';
      if (formValue !== currentValue) {
        mapped[sectionKey] = formValue;
      }
    });

    if (Object.keys(mapped).length === 0) {
      showSnackbar('info', 'There are no changes to save.');
      return;
    }

    setSaving(true);
    try {
      await updateContents(mapped);
      showSnackbar('success', `${page} page content saved.`);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (formKey: string, file: File) => {
    setUploadingKey(formKey);
    try {
      const safe = file.name.replace(/[^\w.-]/g, '-');
      const path = `page-content/${page}-${Date.now()}-${safe}`;
      const { error: upErr } = await supabase.storage.from('media').upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('media').getPublicUrl(path);
      methods.setValue(formKey as keyof FormValues, data.publicUrl);
      showSnackbar('success', 'Image uploaded. Save to publish.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploadingKey(null);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.dark, fontSize: '1.5rem' }}>
          Extra Details
        </Typography>
        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
          Home, About and Contact page copy. Rarely changes but fully editable.
        </Typography>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Tabs
            value={page}
            onChange={(_, v) => setPage(v as PageId)}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              },
              '& .Mui-selected': { color: `${BRAND.primary} !important` },
              '& .MuiTabs-indicator': { bgcolor: BRAND.primary },
            }}
          >
            <Tab label="Home" value="home" />
            <Tab label="About" value="about" />
            <Tab label="Contact" value="contact" />
          </Tabs>
        </CardContent>
      </Card>

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
            {page === 'home' && (
              <Stack spacing={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Hero Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_hero_kicker" label="Kicker" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_hero_caption" label="Lower Caption" max={120} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_hero_title" label="Title" max={200} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_hero_subtitle" label="Subtitle" rows={3} max={400} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_hero_cta" label="Primary Button" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_hero_secondary_cta" label="Secondary Button" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="home_hero_image" label="Hero Background Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Stats Labels
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_stats_installation_label" label="Installations Label" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_stats_capacity_label" label="Capacity Label" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_stats_experience_label" label="Experience Label" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_stats_subsidy_label" label="Subsidy Label" max={60} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Intro Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_intro_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_intro_title" label="Title" max={200} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_intro_body" label="Body" rows={3} max={500} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_intro_caption_title" label="Image Caption Title" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="home_intro_caption_subtitle" label="Image Caption Subtitle" max={80} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="home_intro_image" label="Intro Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Services Section Heading
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="home_services_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="home_services_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_services_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Steps Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="home_steps_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="home_steps_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_steps_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextRow methods={methods} name="home_step1_title" label="Step 1 Title" max={80} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 8 }}>
                            <TextRow methods={methods} name="home_step1_description" label="Step 1 Description" rows={2} max={300} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextRow methods={methods} name="home_step2_title" label="Step 2 Title" max={80} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 8 }}>
                            <TextRow methods={methods} name="home_step2_description" label="Step 2 Description" rows={2} max={300} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextRow methods={methods} name="home_step3_title" label="Step 3 Title" max={80} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 8 }}>
                            <TextRow methods={methods} name="home_step3_description" label="Step 3 Description" rows={2} max={300} />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 4 }}>
                            <TextRow methods={methods} name="home_step4_title" label="Step 4 Title" max={80} />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 8 }}>
                            <TextRow methods={methods} name="home_step4_description" label="Step 4 Description" rows={2} max={300} />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Pricing Section Heading
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="home_pricing_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="home_pricing_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_pricing_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Testimonials Section Heading
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="home_testimonials_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="home_testimonials_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_testimonials_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Bottom CTA Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="home_cta_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="home_cta_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="home_cta_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="home_cta_image" label="CTA Background Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {page === 'about' && (
              <Stack spacing={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Hero Banner
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_hero_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_hero_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="about_hero_image" label="Hero Background Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Story Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="about_story_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_story_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_intro_body" label="Intro Body" rows={3} max={500} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_story_supporting_body" label="Supporting Body" rows={3} max={500} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="about_story_image" label="Story Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Purpose / Mission / Vision
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="about_purpose_eyebrow" label="Purpose Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="about_purpose_title" label="Purpose Title" max={100} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_purpose_subtitle" label="Purpose Subtitle" rows={2} max={200} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="about_mission_title" label="Mission Title" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="about_vision_title" label="Vision Title" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="about_mission_body" label="Mission Body" rows={3} max={400} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="about_vision_body" label="Vision Body" rows={3} max={400} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Why Choose Us
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_why_title" label="Title" max={100} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_why_items" label="Items (one per line)" rows={5} max={500} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Team Section Heading
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="about_team_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="about_team_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="about_team_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Certifications Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextRow methods={methods} name="about_certifications_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 8 }}>
                        <TextRow methods={methods} name="about_certifications_title" label="Title" max={150} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            )}

            {page === 'contact' && (
              <Stack spacing={3}>
                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Hero Banner
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="contact_hero_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="contact_hero_subtitle" label="Subtitle" rows={2} max={300} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <ImageRow methods={methods} name="contact_hero_image" label="Hero Background Image" uploadingKey={uploadingKey} onUpload={uploadImage} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                <Card sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography sx={{ fontWeight: 700, mb: 2, color: BRAND.dark }}>
                      Form Section
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="contact_form_eyebrow" label="Eyebrow" max={60} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextRow methods={methods} name="contact_form_title" label="Title" max={150} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextRow methods={methods} name="contact_form_success_message" label="Success Message" rows={2} max={300} />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Stack>
            )}

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </Box>
          </form>
        </FormProvider>
      )}
    </Box>
  );
}