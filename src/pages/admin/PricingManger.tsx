import { useState } from 'react';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack,
  CircularProgress, Switch, FormControlLabel, Grid,
} from '@mui/material';
import { Edit, Delete, Add, Close as CloseIcon } from '@mui/icons-material';
import { usePricing } from '@/hooks/usePricing';
import { BRAND } from '@/constants/Brand';
import type { PricingPlan } from '@/types';
import { showSnackbar } from '@/components/ToastMessage';

interface FormState {
  kw: number;
  system_type: string;
  total_cost: number;
  subsidy_amount: number;
  final_cost: number;
  monthly_savings: number;
  panels_count: number;
  area_required: string;
  is_popular: boolean;
  sort_order: number;
  is_active: boolean;
}

const EMPTY: FormState = {
  kw: 1,
  system_type: 'on-grid',
  total_cost: 0,
  subsidy_amount: 0,
  final_cost: 0,
  monthly_savings: 0,
  panels_count: 0,
  area_required: '',
  is_popular: false,
  sort_order: 0,
  is_active: true,
};

export default function PricingManager() {
  const { plans, loading, createPlan, updatePlan, deletePlan } = usePricing();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    setEditing(null);
    setForm(EMPTY);
    setOpen(true);
  };

  const handleEdit = (p: PricingPlan) => {
    setEditing(p);
    setForm({
      kw: p.kw,
      system_type: p.system_type ?? 'on-grid',
      total_cost: p.total_cost,
      subsidy_amount: p.subsidy_amount,
      final_cost: p.final_cost,
      monthly_savings: p.monthly_savings ?? 0,
      panels_count: p.panels_count ?? 0,
      area_required: p.area_required ?? '',
      is_popular: p.is_popular,
      sort_order: p.sort_order ?? 0,
      is_active: p.is_active,
    });
    setOpen(true);
  };

  const handleDelete = async (p: PricingPlan) => {
    if (!window.confirm(`Delete ${p.kw} KW plan?`)) return;
    try {
      await deletePlan(p.id);
      showSnackbar('success', 'Pricing plan deleted.');
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Delete failed');
    }
  };

  const handleSave = async () => {
    if (!form.kw || form.kw <= 0) {
      showSnackbar('warning', 'KW must be greater than 0.');
      return;
    }
    setSaving(true);
    try {
      const finalCost = form.final_cost || form.total_cost - form.subsidy_amount;
      const payload = {
        kw: form.kw,
        system_type: form.system_type || 'on-grid',
        total_cost: form.total_cost,
        subsidy_amount: form.subsidy_amount,
        final_cost: finalCost,
        monthly_savings: form.monthly_savings || null,
        panels_count: form.panels_count || null,
        area_required: form.area_required.trim() || null,
        is_popular: form.is_popular,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updatePlan(editing.id, payload);
        showSnackbar('success', 'Pricing plan updated.');
      } else {
        await createPlan(payload);
        showSnackbar('success', 'Pricing plan added.');
      }
      setOpen(false);
    } catch (e) {
      showSnackbar('error', e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

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
            Pricing Manager
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Manage your KW-based solar pricing plans. All costs editable.
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

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 4px 24px rgba(10,37,64,0.06)' }}>
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
                    <Typography sx={{ fontWeight: 700, color: BRAND.dark }}>{p.kw} KW</Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
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
                  <TableCell>{p.monthly_savings ? formatINR(p.monthly_savings) : '—'}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Chip size="small" label={p.is_active ? 'Active' : 'Hidden'} color={p.is_active ? 'success' : 'default'} />
                      {p.is_popular && <Chip size="small" label="Popular" sx={{ bgcolor: BRAND.accent, color: BRAND.dark, fontWeight: 700 }} />}
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

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editing ? 'Edit Plan' : 'Add Plan'}
          <IconButton onClick={() => setOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="System Size (KW)"
                type="number"
                fullWidth
                required
                value={form.kw}
                onChange={(e) => setForm({ ...form, kw: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="System Type"
                select
                fullWidth
                value={form.system_type}
                onChange={(e) => setForm({ ...form, system_type: e.target.value })}
                slotProps={{ select: { native: true } }}
              >
                <option value="on-grid">On-Grid</option>
                <option value="off-grid">Off-Grid</option>
                <option value="hybrid">Hybrid</option>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Sort Order"
                type="number"
                fullWidth
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Total Cost (₹)"
                type="number"
                fullWidth
                value={form.total_cost}
                onChange={(e) => setForm({ ...form, total_cost: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Subsidy Amount (₹)"
                type="number"
                fullWidth
                value={form.subsidy_amount}
                onChange={(e) => setForm({ ...form, subsidy_amount: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Final Cost (₹)"
                type="number"
                fullWidth
                value={form.final_cost}
                onChange={(e) => setForm({ ...form, final_cost: parseFloat(e.target.value) || 0 })}
                helperText="Leave 0 to auto-calculate = Total − Subsidy"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Monthly Savings (₹)"
                type="number"
                fullWidth
                value={form.monthly_savings}
                onChange={(e) => setForm({ ...form, monthly_savings: parseFloat(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Panels Count"
                type="number"
                fullWidth
                value={form.panels_count}
                onChange={(e) => setForm({ ...form, panels_count: parseInt(e.target.value) || 0 })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Area Required"
                fullWidth
                value={form.area_required}
                onChange={(e) => setForm({ ...form, area_required: e.target.value })}
                placeholder="e.g. 300 sq.ft"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction="row" spacing={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={form.is_popular}
                      onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                      sx={{ '&.Mui-checked': { color: BRAND.accent } }}
                    />
                  }
                  label="Mark as Popular"
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
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={saving}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{ bgcolor: BRAND.primary, '&:hover': { bgcolor: BRAND.primaryDark } }}
          >
            {saving ? <CircularProgress size={18} color="inherit" /> : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}