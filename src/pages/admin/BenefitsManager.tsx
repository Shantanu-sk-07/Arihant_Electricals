import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
  Switch, FormControlLabel,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon } from '@mui/icons-material';
import { useBenefits } from '@/hooks/useBenefits';
import { BRAND } from '@/constants/Brand';
import type { SolarBenefit } from '@/types';
import { IconPicker } from '@/utils/IconMapping';
import { showSnackbar } from '@/components/ToastMessage';

interface FormState {
  title: string;
  description: string;
  icon: string;
  stat_value: string;
  stat_label: string;
  sort_order: number;
  is_active: boolean;
}

const EMPTY: FormState = {
  title: '',
  description: '',
  icon: 'savings',
  stat_value: '',
  stat_label: '',
  sort_order: 0,
  is_active: true,
};

export default function BenefitsManager() {
  const { benefits, loading, createBenefit, updateBenefit, deleteBenefit } = useBenefits();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SolarBenefit | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const handleEdit = (b: SolarBenefit) => {
    setEditing(b);
    setForm({
      title: b.title,
      description: b.description,
      icon: b.icon ?? 'savings',
      stat_value: b.stat_value ?? '',
      stat_label: b.stat_label ?? '',
      sort_order: b.sort_order ?? 0,
      is_active: b.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (b: SolarBenefit) => {
    if (!window.confirm(`Delete "${b.title}"?`)) return;
    try {
      await deleteBenefit(b.id);
      showSnackbar('success', 'Benefit deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar('warning', 'Title and Description are required.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        icon: form.icon || null,
        stat_value: form.stat_value.trim() || null,
        stat_label: form.stat_label.trim() || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateBenefit(editing.id, payload);
        showSnackbar('success', 'Benefit updated.');
      } else {
        await createBenefit(payload);
        showSnackbar('success', 'Benefit added.');
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
            Why Solar Benefits
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage the benefit cards shown on the home page "Why Go Solar" section.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAdd}
          sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
        >
          Add Benefit
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: BRAND.light }}>
              <TableCell sx={{ fontWeight: 700 }}>Order</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Stat</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Icon</TableCell>
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
            ) : benefits.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94A3B8' }}>
                  No benefits yet. Click "Add Benefit" to start.
                </TableCell>
              </TableRow>
            ) : (
              benefits.map((b) => (
                <TableRow key={b.id} hover>
                  <TableCell>{b.sort_order}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, color: BRAND.dark }}>{b.title}</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {b.description.slice(0, 60)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {b.stat_value ? (
                      <Chip size="small" label={`${b.stat_value} ${b.stat_label ?? ''}`} sx={{ bgcolor: `${BRAND.success}15`, color: BRAND.success, fontWeight: 700 }} />
                    ) : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={b.icon || '—'} sx={{ bgcolor: BRAND.light, color: BRAND.primary }} />
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={b.is_active ? 'Active' : 'Hidden'} color={b.is_active ? 'success' : 'default'} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(b)} sx={{ color: BRAND.primary }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(b)} sx={{ color: BRAND.error }}>
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
          {editing ? 'Edit Benefit' : 'Add Benefit'}
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
              placeholder="e.g. Save up to 90% on Bills"
            />
            <TextField
              label="Description"
              fullWidth
              required
              multiline
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              label="Stat Value"
              fullWidth
              value={form.stat_value}
              onChange={(e) => setForm({ ...form, stat_value: e.target.value })}
              placeholder="e.g. 90% or ₹78K"
              helperText="Big number shown on the card"
            />
            <TextField
              label="Stat Label"
              fullWidth
              value={form.stat_label}
              onChange={(e) => setForm({ ...form, stat_label: e.target.value })}
              placeholder="e.g. Bill Reduction"
            />
            <IconPicker value={form.icon} onChange={(icon) => setForm({ ...form, icon })} />
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
              label="Active"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : undefined}
            sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
          >
            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}