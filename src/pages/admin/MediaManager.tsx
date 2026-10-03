import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useState } from 'react';
import { useMedia } from '../../hooks/useMedia';
import MediaForm from '@/pages/admin/MediaForm';
import type { Media } from '../../types';
import { showSnackbar } from '@/components/ToastMessage';

export default function MediaManager() {
  const { media, loading, createMedia, updateMedia, deleteMedia, uploadFile } =
    useMedia();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Media | null>(null);

  const handleAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const handleEdit = (m: Media) => {
    setEditing(m);
    setOpen(true);
  };

  const handleDelete = async (m: Media) => {
    if (!confirm(`Delete "${m.title}"?`)) return;
    try {
      await deleteMedia(m.id);
      showSnackbar('success', 'Media item deleted.');
    } catch (error) {
      showSnackbar('error', error instanceof Error ? error.message : 'Unable to delete media item.');
    }
  };

  const handleSave = async (data: Omit<Media, 'id' | 'created_at'>) => {
    if (editing) {
      await updateMedia(editing.id, data);
      showSnackbar('success', 'Media item updated.');
    } else {
      await createMedia(data);
      showSnackbar('success', 'Media item added.');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Media Manager</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleAdd}>
          Add Media
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Order</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={30} />
                </TableCell>
              </TableRow>
            ) : media.map(m => (
              <TableRow key={m.id}>
                <TableCell>
                  {m.type === 'image' ? (
                    <img
                      src={m.url}
                      alt={m.title}
                      style={{
                        width: 60,
                        height: 40,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />
                  ) : (
                    <Typography variant="caption">🎬 Video</Typography>
                  )}
                </TableCell>
                <TableCell>{m.title}</TableCell>
                <TableCell>
                  <Chip size="small" label={m.type} />
                </TableCell>
                <TableCell>{m.sort_order}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(m)}>
                    <Edit />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(m)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!media.length && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No media yet. Click "Add Media".
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <MediaForm
        open={open}
        initial={editing}
        onClose={() => setOpen(false)}
        onSave={handleSave}
        onUpload={uploadFile}
      />

    </Box>
  );
}