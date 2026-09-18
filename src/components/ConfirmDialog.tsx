import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material'

interface ConfirmDialogProps {
  open: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmDialog({
  open,
  title = 'खात्री आहे का?',
  message,
  confirmText = 'हो, पुढे जा',
  cancelText = 'रद्द करा',
  loading = false,
  destructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper:{ sx: { borderRadius: 3 }} }}
    >
      <DialogTitle sx={{ fontWeight: 800 }}>{title}</DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 3 }}>
        <Typography sx={{ lineHeight: 1.7 }}>{message}</Typography>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onCancel} disabled={loading} variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={destructive ? 'error' : 'primary'}
        >
          {loading ? 'प्रक्रिया...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog