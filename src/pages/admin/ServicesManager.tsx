import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
  CircularProgress, Switch, FormControlLabel, InputAdornment,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon } from '@mui/icons-material';
import { useServices } from '@/hooks/useServices';
import { BRAND } from '@/constants/Brand';
import type { Service } from '@/types';
import { IconPicker } from '@/utils/IconMapping';
import { showSnackbar } from '@/components/ToastMessage';

interface FormState {
  title: string;
  short_description: string;
  full_description: string;
  icon: string;
  image_url: string;
  features: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY: FormState = {
  title: '',
  short_description: '',
  full_description: '',
  icon: 'solar_power',
  image_url: '',
  features: '',
  sort_order: 0,
  is_active: true,
};

export default function ServicesManager() {
  const {
    services,
    loading,
    createService,
    updateService,
    deleteService,
    uploadServiceImage,
  } = useServices();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setForm({
      title: s.title,
      short_description: s.short_description ?? '',
      full_description: s.full_description ?? '',
      icon: s.icon ?? 'solar_power',
      image_url: s.image_url ?? '',
      features: (s.features ?? []).join('\n'),
      sort_order: s.sort_order ?? 0,
      is_active: s.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (s: Service) => {
    if (!window.confirm(`Delete "${s.title}"?`)) return;
    try {
      await deleteService(s.id);
      showSnackbar('success', 'Service deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleImage = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadServiceImage(file);
      setForm((f) => ({ ...f, image_url: url }));
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      showSnackbar('warning', 'Title is required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        short_description: form.short_description.trim() || null,
        full_description: form.full_description.trim() || null,
        icon: form.icon || null,
        image_url: form.image_url || null,
        features: form.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateService(editing.id, payload);
        showSnackbar('success', 'Service updated.');
      } else {
        await createService(payload);
        showSnackbar('success', 'Service added.');
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
            Services Manager
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage your services shown on the home & services pages.
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}>
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
                    <Typography sx={{ fontWeight: 600, color: BRAND.dark }}>{s.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {s.short_description?.slice(0, 60) || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={s.icon || '—'} sx={{ bgcolor: BRAND.light, color: BRAND.primary, fontWeight: 600 }} />
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Service' : 'Add Service'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              fullWidth
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <TextField
              label="Short Description"
              fullWidth
              multiline
              rows={2}
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              helperText="Shown on the home page preview card"
            />
            <TextField
              label="Full Description"
              fullWidth
              multiline
              rows={4}
              value={form.full_description}
              onChange={(e) => setForm({ ...form, full_description: e.target.value })}
              helperText="Shown on the services page"
            />
            <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
            <TextField
              label="Features (one per line)"
              fullWidth
              multiline
              rows={5}
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              helperText="Each line becomes a bullet point"
            />
            <Box>
              <Button variant="outlined" component="label" disabled={uploading} sx={{ borderColor: BRAND.primary, color: BRAND.primary }}>
                {uploading ? <CircularProgress size={18} /> : 'Upload Image (optional)'}
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
                  <img src={form.image_url} alt="preview" style={{ maxWidth: 200, maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
                </Box>
              )}
            </Box>
            <TextField
              label="Sort Order"
              type="number"
              fullWidth
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              slotProps={{
                input: { endAdornment: <InputAdornment position="end">Lower = first</InputAdornment> },
              }}
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