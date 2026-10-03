import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useEffect, useState } from 'react';
import type { Media } from '../../types';
import { Save } from '@mui/icons-material';
import { showSnackbar } from '@/components/ToastMessage';

interface Props {
  open: boolean;
  initial?: Media | null;
  onClose: () => void;
  onSave: (data: Omit<Media, 'id' | 'created_at'>) => Promise<void>;
  onUpload: (file: File) => Promise<string>;
}

type MediaFormState = Omit<Media, 'id' | 'created_at'>;

const EMPTY_FORM: MediaFormState = {
  title: '',
  description: '',
  type: 'image',
  url: '',
  thumbnail_url: '',
  sort_order: 0,
};

export default function MediaForm({
  open,
  initial,
  onClose,
  onSave,
  onUpload,
}: Props) {
  const [form, setForm] = useState<MediaFormState>(EMPTY_FORM);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _id, created_at: _createdAt, ...rest } = initial;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(rest);
    } else {
      setForm(EMPTY_FORM);
    }
  }, [initial, open]);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const url = await onUpload(file);
      setForm((f) => ({ ...f, url }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      showSnackbar('error', `Upload failed: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.url) {
      showSnackbar('warning', 'Title and URL are required.');
      return;
    }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      showSnackbar('error', `Save failed: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? 'Edit Media' : 'Add Media'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Title"
            fullWidth
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            value={form.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            select
            label="Type"
            fullWidth
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value as 'image' | 'video' })
            }
          >
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video (YouTube Embed URL)</MenuItem>
          </TextField>

          {form.type === 'image' ? (
            <Box>
              <Button variant="outlined" component="label" disabled={uploading}>
                {uploading ? <CircularProgress size={20} /> : 'Upload Image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />
              </Button>
              {form.url && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={form.url}
                    alt="preview"
                    style={{
                      maxWidth: '100%',
                      maxHeight: 200,
                      borderRadius: 8,
                    }}
                  />
                </Box>
              )}
            </Box>
          ) : (
            <TextField
              label="YouTube Embed URL"
              fullWidth
              required
              placeholder="https://www.youtube.com/embed/VIDEO_ID"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              helperText="Use the /embed/ format, not the watch URL"
            />
          )}

          <TextField
            label="Sort Order"
            type="number"
            fullWidth
            value={form.sort_order}
            onChange={(e) =>
              setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })
            }
            helperText="Lower numbers appear first"
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving || uploading}
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}