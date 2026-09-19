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
    <Box
      sx={{
        p: { xs: 1.25, sm: 1.5 },
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        background: 'linear-gradient(135deg, #fffdfa 0%, #faf3ea 100%)',
        height: '100%',
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 700,
          display: 'block',
          letterSpacing: 0.4,
          textTransform: 'uppercase',
          fontSize: 10.5,
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mt: 0.25,
          fontSize: { xs: 14, sm: 15 },
          wordBreak: 'break-word',
        }}
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
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            overflow: 'hidden',
            m: { xs: '2px', sm: 2 },
            width: { xs: 'calc(100% - 4px)', sm: '100%' },
            maxWidth: { xs: 'calc(100% - 4px)', sm: '900px' },
            maxHeight: { xs: 'calc(100% - 4px)', sm: '92vh' },
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          background:
            'linear-gradient(135deg, #a94e0a 0%, #7c2905 100%)',
          color: '#fff',
          py: { xs: 2, sm: 2.5 },
          px: { xs: 4, sm: 6 },
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            color: '#fff',
            position: 'absolute',
            top: { xs: 8, sm: 12 },
            right: { xs: 8, sm: 12 },
          }}
          disabled={loading}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            width: { xs: 44, sm: 52 },
            height: { xs: 44, sm: 52 },
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(145deg, #fff8e8, #ffd9a8)',
            color: '#7c2905',
            fontSize: { xs: 22, sm: 26 },
            fontWeight: 800,
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.25)',
            mb: 1,
          }}
        >
          ॐ
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.25,
            fontSize: { xs: '1rem', sm: '1.35rem' },
            wordBreak: 'break-word',
          }}
        >
          {record.mandal_name}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: { xs: 11, sm: 12 },
            mt: 0.25,
          }}
        >
          नोंद तपशील
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent
        sx={{
          p: { xs: 1.5, sm: 3 },
          position: 'relative',
          minHeight: 240,
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

        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 800,
              mb: 1.25,
              color: 'primary.dark',
              fontSize: { xs: 14, sm: 16 },
            }}
          >
            📷 मूर्तीचे फोटो ({photos.length})
          </Typography>

          {photos.length === 0 ? (
            <Typography color="text.secondary" sx={{ fontSize: 13 }}>
              फोटो उपलब्ध नाही
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 1, sm: 2 }}>
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

        <Divider sx={{ mb: { xs: 2, sm: 2.5 } }} />

        <Grid container spacing={{ xs: 1.25, sm: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="गाव / पत्ता"
              value={record.mandal_village || '—'}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <InfoRow
              label="अध्यक्षाचे नाव"
              value={record.president_name}
            />
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
          <Grid size={{ xs: 12, sm: 6 }}>
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
          p: { xs: 1.5, sm: 2.5 },
          display: 'flex',
          flexDirection: { xs: 'column-reverse', sm: 'row' },
          justifyContent: { xs: 'stretch', sm: 'space-between' },
          alignItems: 'stretch',
          gap: { xs: 1, sm: 1.5 },
        }}
      >
        <Button
          onClick={() => onDelete(record)}
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          disabled={loading}
          fullWidth
          sx={{
            fontWeight: 700,
            textTransform: 'none',
            width: { xs: '100%', sm: 'auto' },
            order: { xs: 3, sm: 1 },
          }}
        >
          Delete
        </Button>

        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            order: { xs: 1, sm: 2 },
          }}
        >
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            fullWidth
            sx={{
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onEdit(record)}
            variant="contained"
            startIcon={<EditIcon />}
            disabled={loading}
            fullWidth
            sx={{
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            Edit
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

export default AdminViewMandal