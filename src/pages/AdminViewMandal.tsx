import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { MandalRecord } from '../types'
import { stringToPhotoUrls } from '../utils/photoUtils'

interface AdminViewMandalProps {
  open: boolean
  record: MandalRecord | null
  loading?: boolean
  onClose: () => void
  onEdit: (record: MandalRecord) => void
  onDelete: (record: MandalRecord) => void
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 700,
          display: 'block',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          fontSize: 11,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}
      >
        {value}
      </Typography>
    </Box>
  )
}

function AdminViewMandal({
  open,
  record,
  loading = false,
  onClose,
  onEdit,
  onDelete,
}: AdminViewMandalProps) {
  if (!record) return null

  const photos = stringToPhotoUrls(record.idol_photo_url)

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: 3, overflow: 'hidden' } },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background:
            'linear-gradient(135deg, #a94e0a 0%, #7c2905 100%)',
          color: '#fff',
          fontWeight: 800,
          py: 2,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, color: '#fff' }}
          >
            {record.mandal_name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255,255,255,0.85)' }}
          >
            नोंद तपशील
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{ color: '#fff' }}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          position: 'relative',
          minHeight: 280,
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(255,255,255,0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 800, mb: 1.5, color: 'primary.dark' }}
          >
            📷 मूर्तीचे फोटो ({photos.length})
          </Typography>

          {photos.length === 0 ? (
            <Typography color="text.secondary">
              फोटो उपलब्ध नाही
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {photos.map((url, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={url}>
                  <Box
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      position: 'relative',
                      display: 'block',
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '2px solid',
                      borderColor: 'divider',
                      aspectRatio: '1 / 1',
                      background: '#f5f5f5',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textDecoration: 'none',
                      '&:hover': {
                        borderColor: 'primary.main',
                        boxShadow:
                          '0 8px 24px rgba(169, 78, 10, 0.25)',
                        transform: 'translateY(-2px)',
                      },
                      '&:hover .zoom-hint': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={url}
                      alt={`Photo ${i + 1}`}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        px: 1.25,
                        py: 0.25,
                        borderRadius: 1.5,
                        background: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Photo {i + 1}
                    </Box>
                    <Box
                      className="zoom-hint"
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: 13,
                        fontWeight: 700,
                        opacity: 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      🔍 मोठा फोटो उघडा
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow label="अध्यक्षाचे नाव" value={record.president_name} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="मोबाईल"
              value={
                <a
                  href={`tel:${record.president_mobile}`}
                  style={{
                    color: '#a94e0a',
                    textDecoration: 'none',
                    fontWeight: 700,
                  }}
                >
                  {record.president_mobile}
                </a>
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="दिनांक"
              value={formatDate(record.created_at)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="वेळ"
              value={formatTime(record.created_at)}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <InfoRow
              label="माहितीचा प्रकार"
              value={record.information_type}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Button
          onClick={() => onDelete(record)}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
          sx={{ fontWeight: 700 }}
        >
          डिलीट करा
        </Button>
        <Stack direction="row" spacing={1.5}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
          >
            बंद करा
          </Button>
          <Button
            onClick={() => onEdit(record)}
            variant="contained"
            startIcon={<EditIcon />}
            disabled={loading}
            sx={{ fontWeight: 700 }}
          >
            संपादित करा
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default AdminViewMandal