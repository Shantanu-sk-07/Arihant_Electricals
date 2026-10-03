import { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, Grid,
  Dialog, DialogTitle, DialogContent, DialogActions, Stack,
  CircularProgress, Card, CardContent, Divider, MenuItem, TextField,
} from '@mui/material';
import {
  Edit, Delete, Add, Close as CloseIcon, Save, CloudUpload,
} from '@mui/icons-material';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { useMedia } from '@/hooks/useMedia';
import { useContent } from '@/hooks/useContent';
import { supabase } from '@/lib/supabase';
import { BRAND } from '@/constants/Brand';
import type { Media } from '@/types';
import TextInputField from '@/components/TextInputField';
import NumericField from '@/components/NumericField';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';

interface MediaFormValues {
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  sort_order: string;
}

interface PageCopyValues {
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  gallery_eyebrow: string;
  gallery_title: string;
  gallery_subtitle: string;
}

const EMPTY_MEDIA: MediaFormValues = {
  title: '',
  description: '',
  type: 'image',
  url: '',
  sort_order: '0',
};

/**
 * Converts any common YouTube URL into an embed URL.
 * Accepts:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://m.youtube.com/watch?v=VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID (already correct)
 * Falls back to the original string if no match.
 */
function toYouTubeEmbed(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();

  // Already an embed URL
  if (/youtube\.com\/embed\/[A-Za-z0-9_-]{11}/.test(trimmed)) return trimmed;

  // Extract video ID from any known pattern
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return trimmed;
}

export default function MediaManager() {
  const {
    media, loading, createMedia, updateMedia, deleteMedia, uploadFile,
  } = useMedia();
  const { content, loading: contentLoading, updateContents } = useContent('media');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingCopy, setSavingCopy] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  const mediaMethods = useForm<MediaFormValues>({ defaultValues: EMPTY_MEDIA });
  const copyMethods = useForm<PageCopyValues>({
    defaultValues: {
      hero_title: '',
      hero_subtitle: '',
      hero_image: '',
      gallery_eyebrow: '',
      gallery_title: '',
      gallery_subtitle: '',
    },
  });

  const heroImage = useWatch({ control: copyMethods.control, name: 'hero_image' });
  const mediaType = useWatch({ control: mediaMethods.control, name: 'type' });
  const mediaUrl = useWatch({ control: mediaMethods.control, name: 'url' });

  useEffect(() => {
    if (Object.keys(content).length === 0) return;
    copyMethods.reset({
      hero_title: content['hero.title'] ?? '',
      hero_subtitle: content['hero.subtitle'] ?? '',
      hero_image: content['hero.image'] ?? '',
      gallery_eyebrow: content['gallery.eyebrow'] ?? '',
      gallery_title: content['gallery.title'] ?? '',
      gallery_subtitle: content['gallery.subtitle'] ?? '',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const handleAdd = () => {
    setEditing(null);
    mediaMethods.reset(EMPTY_MEDIA);
    setOpen(true);
  };

  const handleEdit = (m: Media) => {
    setEditing(m);
    mediaMethods.reset({
      title: m.title,
      description: m.description ?? '',
      type: m.type,
      url: m.url,
      sort_order: String(m.sort_order ?? 0),
    });
    setOpen(true);
  };

  const handleDelete = async (m: Media) => {
    const ok = await showConfirmation({
      message: `Delete "${m.title}"? This action cannot be undone.`,
      title: 'Delete Media',
      confirmText: 'Delete',
      confirmColor: 'error',
      icon: '🗑️',
    });
    if (!ok) return;
    try {
      await deleteMedia(m.id);
      showSnackbar('success', 'Media item deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleMediaUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFile(file);
      mediaMethods.setValue('url', url);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleHeroImage = async (file: File) => {
    setUploadingHero(true);
    try {
      const path = `page-heroes/media-${Date.now()}-${file.name}`;
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

  const onSubmitMedia = async (values: MediaFormValues) => {
    const finalUrl =
      values.type === 'video' ? toYouTubeEmbed(values.url.trim()) : values.url.trim();

    if (!values.title.trim() || !finalUrl) {
      showSnackbar('warning', 'Title and URL are required.');
      return;
    }

    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim() || null,
        type: values.type,
        url: finalUrl,
        thumbnail_url: null,
        sort_order: parseInt(values.sort_order) || 0,
      };
      if (editing) {
        await updateMedia({ id: editing.id, patch: payload });
        showSnackbar('success', 'Media item updated.');
      } else {
        await createMedia(payload);
        showSnackbar('success', 'Media item added.');
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
      'gallery.eyebrow': values.gallery_eyebrow,
      'gallery.title': values.gallery_title,
      'gallery.subtitle': values.gallery_subtitle,
    };
    setSavingCopy(true);
    try {
      await updateContents(mapped);
      showSnackbar('success', 'Media page copy saved.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSavingCopy(false);
    }
  };

  const savingMedia = mediaMethods.formState.isSubmitting;

  return (
    <Box>
      {/* SECTION 1 — MEDIA LIST */}
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
            Media Gallery
          </Typography>
          <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
            Images and videos shown on the Media page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Media
        </Button>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)', mb: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: BRAND.light }}>
              <TableCell sx={{ fontWeight: 700 }}>Preview</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} sx={{ color: BRAND.primary }} />
                </TableCell>
              </TableRow>
            ) : media.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                  No media yet. Click "Add Media" to start.
                </TableCell>
              </TableRow>
            ) : (
              media.map((m) => (
                <TableRow key={m.id} hover>
                  <TableCell>
                    {m.type === 'image' ? (
                      <Box
                        component="img"
                        src={m.url}
                        alt={m.title}
                        sx={{
                          width: 60,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 1,
                          border: `1px solid ${BRAND.light}`,
                        }}
                      />
                    ) : (
                      <Chip size="small" label="🎬 Video" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: BRAND.dark }}>
                      {m.title}
                    </Typography>
                    <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem' }}>
                      {m.description?.slice(0, 50) || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={m.type}
                      sx={{
                        bgcolor: m.type === 'image' ? `${BRAND.primary}15` : `${BRAND.secondary}15`,
                        color: m.type === 'image' ? BRAND.primary : BRAND.secondary,
                        fontWeight: 700,
                      }}
                    />
                  </TableCell>
                  <TableCell>{m.sort_order}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(m)} sx={{ color: BRAND.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(m)} sx={{ color: BRAND.error }}>
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

      {/* SECTION 2 — MEDIA PAGE COPY */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontWeight: 700, color: BRAND.dark, fontSize: '1.5rem' }}>
          Media Page Copy
        </Typography>
        <Typography sx={{ color: '#64748B', mt: 0.5, fontSize: '0.875rem' }}>
          Hero banner and gallery heading text.
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
                  Gallery Section Heading
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextInputField
                      name="gallery_eyebrow"
                      label="Eyebrow"
                      inputType="all"
                      maxLength={60}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextInputField
                      name="gallery_title"
                      label="Title"
                      inputType="all"
                      maxLength={120}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextInputField
                      name="gallery_subtitle"
                      label="Subtitle"
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

      {/* MEDIA DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          {editing ? 'Edit Media' : 'Add Media'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <FormProvider {...mediaMethods}>
          <form onSubmit={mediaMethods.handleSubmit(onSubmitMedia)}>
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
                  name="description"
                  label="Description"
                  inputType="all"
                  rows={2}
                  maxLength={300}
                />
                <TextField
                  select
                  fullWidth
                  label="Type"
                  value={mediaType}
                  onChange={(e) =>
                    mediaMethods.setValue('type', e.target.value as 'image' | 'video')
                  }
                >
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="video">Video (YouTube URL)</MenuItem>
                </TextField>

                {mediaType === 'image' ? (
                  <Box>
                    <Button
                      variant="outlined"
                      component="label"
                      disabled={uploading}
                      sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
                      startIcon={uploading ? <CircularProgress size={18} /> : <CloudUpload />}
                    >
                      {uploading ? 'Uploading…' : 'Upload Image'}
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleMediaUpload(f);
                          e.target.value = '';
                        }}
                      />
                    </Button>
                    {mediaUrl && (
                      <Box sx={{ mt: 2 }}>
                        <Box
                          component="img"
                          src={mediaUrl}
                          alt="preview"
                          sx={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: 2,
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                ) : (
                  <TextInputField
                    name="url"
                    label="YouTube URL"
                    required
                    inputType="all"
                    maxLength={300}
                  />
                )}

                <NumericField
                  name="sort_order"
                  label="Sort Order"
                  min={0}
                  max={9999}
                  maxlength={4}
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setOpen(false)} disabled={savingMedia}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={savingMedia || uploading}
                startIcon={
                  savingMedia ? <CircularProgress size={18} color="inherit" /> : <Save />
                }
                sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
              >
                {savingMedia ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>
    </Box>
  );
}