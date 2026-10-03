import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
  CircularProgress, Switch, FormControlLabel, Rating, Avatar,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon } from '@mui/icons-material';
import { useTestimonials } from '@/hooks/useTestimonials';
import { BRAND } from '@/constants/Brand';
import type { Testimonial } from '@/types';
import { showSnackbar } from '@/components/ToastMessage';

interface FormState {
  name: string;
  location: string;
  rating: number;
  message: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY: FormState = {
  name: '',
  location: '',
  rating: 5,
  message: '',
  image_url: '',
  sort_order: 0,
  is_active: true,
};

export default function TestimonialsManager() {
  const {
    testimonials,
    loading,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    uploadTestimonialImage,
  } = useTestimonials();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      name: t.name,
      location: t.location ?? '',
      rating: t.rating,
      message: t.message,
      image_url: t.image_url ?? '',
      sort_order: t.sort_order ?? 0,
      is_active: t.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (t: Testimonial) => {
    if (!window.confirm(`Delete testimonial from ${t.name}?`)) return;
    try {
      await deleteTestimonial(t.id);
      showSnackbar('success', 'Testimonial deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadTestimonialImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      showSnackbar('warning', 'Name and Message are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        location: form.location.trim() || null,
        rating: form.rating,
        message: form.message.trim(),
        image_url: form.image_url || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateTestimonial(editing.id, payload);
        showSnackbar('success', 'Testimonial updated.');
      } else {
        await createTestimonial(payload);
        showSnackbar('success', 'Testimonial added.');
      }
      setOpen(false);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
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
          <Typography variant="h4" sx={{ fontWeight: 700, color: BRAND.dark }}>
            Testimonials Manager
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage customer reviews shown on the home page.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Testimonial
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: BRAND.light }}>
              <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
            ) : testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                  No testimonials yet. Click "Add Testimonial" to start.
                </TableCell>
              </TableRow>
            ) : (
              testimonials.map((t) => (
                <TableRow key={t.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Avatar sx={{ bgcolor: BRAND.primary, width: 36, height: 36 }}>
                        {t.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 600, color: BRAND.dark, fontSize: '0.9rem' }}>
                          {t.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                          {t.location}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Rating value={t.rating} readOnly size="small" sx={{ color: BRAND.accent }} />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ color: '#475569' }}>
                      {t.message.slice(0, 80)}{t.message.length > 80 ? '...' : ''}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={t.is_active ? 'Active' : 'Hidden'} color={t.is_active ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(t)} sx={{ color: BRAND.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(t)} sx={{ color: BRAND.error }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Testimonial' : 'Add Testimonial'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Customer Name"
              fullWidth
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <TextField
              label="Location"
              fullWidth
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Pune, Mumbai, Nashik"
            />
            <Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600, color: '#64748B' }}>
                Rating
              </Typography>
              <Rating
                value={form.rating}
                onChange={(_, v) => setForm({ ...form, rating: v || 5 })}
                sx={{ color: BRAND.accent }}
              />
            </Box>
            <TextField
              label="Message"
              fullWidth
              required
              multiline
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <Box>
              <Button
                variant="outlined"
                component="label"
                disabled={uploading}
                sx={{ borderColor: BRAND.primary, color: BRAND.primary }}
              >
                {uploading ? <CircularProgress size={18} /> : 'Upload Photo (optional)'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImage(f);
                  }}
                />
              </Button>
              {form.image_url && (
                <Box sx={{ mt: 2 }}>
                  <Avatar src={form.image_url} sx={{ width: 60, height: 60 }} />
                </Box>
              )}
            </Box>
            <TextField
              label="Sort Order"
              type="number"
              fullWidth
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  sx={{ '&.Mui-checked': { color: BRAND.success } }}
                />
              }
              label="Active (visible on website)"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || uploading}
            sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}