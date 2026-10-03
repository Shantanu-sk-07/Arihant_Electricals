import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Contact } from '../../types';
import { showSnackbar } from '@/components/ToastMessage';

export default function ContactsList() {
  const [items, setItems] = useState<Contact[]>([]);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setItems((data as Contact[]) ?? []);
    } catch (error) {
      showSnackbar('error', error instanceof Error ? error.message : 'Unable to load contact messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const ch = supabase
      .channel('contacts-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'contacts' },
        load
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  const openMessage = async (c: Contact) => {
    setViewing(c);
    if (!c.is_read) {
      await supabase.from('contacts').update({ is_read: true }).eq('id', c.id);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    await supabase.from('contacts').delete().eq('id', id);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contact Messages
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : items.map(c => (
              <TableRow
                key={c.id}
                sx={{ bgcolor: c.is_read ? 'inherit' : '#fff8e1' }}
              >
                <TableCell>
                  {c.is_read ? (
                    <Chip size="small" label="Read" />
                  ) : (
                    <Chip size="small" color="warning" label="New" />
                  )}
                </TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone || '-'}</TableCell>
                <TableCell>
                  {new Date(c.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => openMessage(c)}>
                    <Visibility />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(c.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!items.length && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No messages yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Message from {viewing?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {viewing?.email} • {viewing?.phone}
          </Typography>
          <Typography sx={{ mt: 2, whiteSpace: 'pre-line' }}>
            {viewing?.message}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewing(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}