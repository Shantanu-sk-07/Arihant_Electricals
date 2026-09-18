/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import GridOnIcon from '@mui/icons-material/GridOn'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import { useNavigate } from 'react-router-dom'
import { supabase, BUCKET_NAME } from '../supabase'
import {
  INFORMATION_TYPES,
  type InformationType,
  type MandalRecord,
} from '../types'
import { stringToPhotoUrls } from '../utils/photoUtils'
import { exportRecordsToExcel } from '../utils/exportExcel'
import { exportRecordsToPdf } from '../utils/exportPdf'
import { UniversalTable } from '../components/UniversalTable'
import type { Column } from '../components/UniversalTable'
import {
  showConfirmation,
  showSnackbar,
} from '../components/ToastMessage'
import AdminMandalForm, {
  type AdminMandalFormMode,
} from '../pages/AdminMandalForm'
import AdminViewMandal from '../pages/AdminViewMandal'

type SortKey = 'newest' | 'oldest'

const ACTION_KEY = 'actionbutton' as const

interface TableRow extends MandalRecord {
  [key: string]: unknown
}

function toMarathiNumber(n: number): string {
  const digits = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९']
  return String(n)
    .split('')
    .map((d) => digits[Number(d)] ?? d)
    .join('')
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return iso
  }
}

function AdminDashboard() {
  const navigate = useNavigate()

  const [records, setRecords] = useState<TableRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<'all' | InformationType>('all')
  const [sortKey, setSortKey] = useState<SortKey>('newest')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  const [formOpen, setFormOpen] = useState(false)
  const [formMode, setFormMode] = useState<AdminMandalFormMode>('add')
  const [editingRecord, setEditingRecord] = useState<MandalRecord | null>(null)

  const [viewOpen, setViewOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<MandalRecord | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [pdfLoading, setPdfLoading] = useState(false)

  const loadRecords = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('ganesh_mandal_records_2026')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      showSnackbar('error', error.message)
      setRecords([])
    } else {
      setRecords((data ?? []) as TableRow[])
    }
    setLoading(false)
  }

  useEffect(() => {
    void loadRecords()
  }, [])

  const handleLogout = async () => {
    const ok = await showConfirmation({
      message: 'तुम्हाला लॉगआउट करायचे आहे का?',
      title: 'लॉगआउट करा',
      confirmText: 'हो, लॉगआउट करा',
      cancelText: 'रद्द करा',
      confirmColor: 'warning',
      icon: '🚪',
      description: 'तुम्ही पुन्हा लॉगिन करू शकता.',
    })
    if (!ok) return
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  const filtered = useMemo(() => {
    let list = [...records]

    if (filterType !== 'all') {
      list = list.filter((r) => r.information_type === filterType)
    }

    if (dateFrom) {
      const fromTime = new Date(dateFrom).setHours(0, 0, 0, 0)
      list = list.filter((r) => new Date(r.created_at).getTime() >= fromTime)
    }
    if (dateTo) {
      const toTime = new Date(dateTo).setHours(23, 59, 59, 999)
      list = list.filter((r) => new Date(r.created_at).getTime() <= toTime)
    }

    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (r) =>
          r.mandal_name.toLowerCase().includes(q) ||
          r.president_name.toLowerCase().includes(q) ||
          r.president_mobile.includes(q),
      )
    }

    if (sortKey === 'newest') {
      list.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime(),
      )
    } else {
      list.sort(
        (a, b) =>
          new Date(a.created_at).getTime() -
          new Date(b.created_at).getTime(),
      )
    }

    return list
  }, [records, filterType, search, sortKey, dateFrom, dateTo])

  const counts = useMemo(
    () => ({
      total: records.length,
      taken: records.filter(
        (r) => r.information_type === INFORMATION_TYPES.TAKEN,
      ).length,
      upcoming: records.filter(
        (r) => r.information_type === INFORMATION_TYPES.UPCOMING,
      ).length,
    }),
    [records],
  )

  const openAdd = () => {
    setFormMode('add')
    setEditingRecord(null)
    setFormOpen(true)
  }

  const openEditDirect = (row: MandalRecord) => {
    setFormMode('edit')
    setEditingRecord(row)
    setFormOpen(true)
  }

  const openView = (row: MandalRecord) => {
    setViewRecord(row)
    setViewOpen(true)
  }

  const handleEditFromView = (row: MandalRecord) => {
    setViewOpen(false)
    setViewRecord(null)
    setTimeout(() => {
      setFormMode('edit')
      setEditingRecord(row)
      setFormOpen(true)
    }, 200)
  }

  const handleDelete = async (row: MandalRecord) => {
    const ok = await showConfirmation({
      message: `${row.mandal_name} ची नोंद कायमची डिलीट करायची आहे का?`,
      title: 'नोंद डिलीट करा',
      confirmText: 'हो, डिलीट करा',
      cancelText: 'रद्द करा',
      confirmColor: 'error',
      icon: '🗑️',
      description: 'ही क्रिया परत करता येणार नाही.',
    })
    if (!ok) return

    setDeleting(true)
    try {
      const paths = stringToPhotoUrls(row.idol_photo_url)
        .map((u: string) => u.split('/').pop() ?? '')
        .filter(Boolean)

      if (paths.length > 0) {
        await supabase.storage.from(BUCKET_NAME).remove(paths)
      }

      const { error } = await supabase
        .from('ganesh_mandal_records_2026')
        .delete()
        .eq('id', row.id)

      if (error) {
        showSnackbar('error', `डिलीट झाला नाही: ${error.message}`)
        return
      }

      showSnackbar('success', 'नोंद यशस्वीरित्या डिलीट झाली.')
      setViewOpen(false)
      setViewRecord(null)
      await loadRecords()
    } finally {
      setDeleting(false)
    }
  }

  const handleExcel = () => {
    if (filtered.length === 0) {
      showSnackbar('info', 'एक्सपोर्ट करण्यासाठी नोंदी नाहीत.')
      return
    }
    exportRecordsToExcel(filtered)
    showSnackbar('success', 'Excel फाइल तयार झाली.')
  }

  const handlePdf = async () => {
    if (filtered.length === 0) {
      showSnackbar('info', 'एक्सपोर्ट करण्यासाठी नोंदी नाहीत.')
      return
    }
    setPdfLoading(true)
    try {
      await exportRecordsToPdf(filtered)
      showSnackbar('success', 'PDF फाइल तयार झाली.')
    } catch {
      showSnackbar('error', 'PDF तयार करताना चूक झाली.')
    } finally {
      setPdfLoading(false)
    }
  }

  const initialFormValues = useMemo(() => {
    if (!editingRecord) return undefined
    return {
      mandal_name: editingRecord.mandal_name,
      president_name: editingRecord.president_name,
      president_mobile: editingRecord.president_mobile,
      information_type: editingRecord.information_type as InformationType,
      newPhotos: [],
      existingPhotos: stringToPhotoUrls(editingRecord.idol_photo_url),
      removedPhotos: [],
    }
  }, [editingRecord])

  const columns: Column<TableRow>[] = [
    {
      key: 'mandal_name',
      label: 'मंडळाचे नाव',
      minWidth: 180,
    },
    {
      key: 'president_name',
      label: 'अध्यक्षाचे नाव',
      minWidth: 160,
    },
    {
      key: 'president_mobile',
      label: 'मोबाईल',
      width: 130,
      render: (row) => (
        <a
          href={`tel:${row.president_mobile}`}
          style={{ color: '#a94e0a', fontWeight: 600 }}
        >
          {row.president_mobile}
        </a>
      ),
    },
    {
      key: 'information_type',
      label: 'माहितीचा प्रकार',
      minWidth: 220,
    },
    {
      key: 'idol_photo_url',
      label: 'Photos',
      minWidth: 200,
      render: (row) => {
        const urls = stringToPhotoUrls(row.idol_photo_url)
        if (urls.length === 0) return '—'
        return (
          <>
            {urls.map((u, i) => (
              <a
                key={u}
                href={u}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#0563C1',
                  fontWeight: 700,
                  textDecoration: 'underline',
                  marginRight: 10,
                }}
              >
                Photo {i + 1}
              </a>
            ))}
          </>
        )
      },
    },
    {
      key: 'created_at',
      label: 'दिनांक / वेळ',
      width: 160,
      render: (row) => formatDateTime(row.created_at),
    },
    {
      key: ACTION_KEY,
      label: 'कृती',
      width: 140,
      align: 'center',
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        py: { xs: 2, sm: 3 },
        px: 2,
        position: 'relative',
        background:
          'radial-gradient(circle at top, #fffaf4 0%, #f6efe6 45%, #eee1d2 100%)',
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: 'fixed',
          top: '12%',
          right: '-60px',
          fontSize: 240,
          opacity: 0.04,
          color: '#7c2905',
          fontWeight: 900,
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 0,
        }}
      >
        ॐ
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.75, sm: 2.25 },
            mb: 2,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            background:
              'linear-gradient(135deg, #fffdfa 0%, #faf3ea 100%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'stretch', sm: 'center' },
              gap: 1.5,
            }}
          >
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(145deg, #b96b13, #7c3907)',
                  color: '#fff8e8',
                  fontSize: 20,
                  fontWeight: 700,
                  boxShadow: '0 6px 14px rgba(126, 64, 13, 0.25)',
                }}
              >
                ॐ
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.dark',
                    lineHeight: 1.2,
                  }}
                >
                  अ‍ॅडमिन डॅशबोर्ड
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  गणेशमूर्ती मंडळ माहिती नोंदणी २०२६
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                size="small"
                startIcon={<AddIcon />}
                variant="contained"
                onClick={openAdd}
                sx={{ fontWeight: 700, px: 2 }}
              >
                नवीन नोंद
              </Button>
              <Tooltip title="लॉगआउट">
                <IconButton
                  size="small"
                  onClick={handleLogout}
                  color="error"
                  sx={{
                    border: '1px solid',
                    borderColor: 'error.main',
                  }}
                >
                  <LogoutIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },
            gap: 1.5,
            mb: 2,
          }}
        >
          <Card
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent
              sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              >
                एकूण नोंदी
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 800, mt: 0.5, lineHeight: 1 }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  toMarathiNumber(counts.total)
                )}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent
              sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              >
                २०२६ मध्ये मूर्ती घेतलेले
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  lineHeight: 1,
                  color: 'primary.main',
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  toMarathiNumber(counts.taken)
                )}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: 2.5,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <CardContent
              sx={{ py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 700, letterSpacing: 0.5 }}
              >
                आगामी वर्षासाठी अपेक्षित
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  mt: 0.5,
                  lineHeight: 1,
                  color: 'secondary.main',
                }}
              >
                {loading ? (
                  <CircularProgress size={20} />
                ) : (
                  toMarathiNumber(counts.upcoming)
                )}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            mb: 2,
            borderRadius: 2.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
                md: '2fr 1.4fr 1fr 1fr 1fr auto auto',
              },
              gap: 1.25,
              alignItems: 'center',
            }}
          >
            <TextField
              size="small"
              placeholder="मंडळ / अध्यक्ष / मोबाईल शोधा..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              select
              size="small"
              label="फिल्टर"
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as 'all' | InformationType)
              }
              fullWidth
            >
              <MenuItem value="all">सर्व</MenuItem>
              <MenuItem value={INFORMATION_TYPES.TAKEN}>
                {INFORMATION_TYPES.TAKEN}
              </MenuItem>
              <MenuItem value={INFORMATION_TYPES.UPCOMING}>
                {INFORMATION_TYPES.UPCOMING}
              </MenuItem>
            </TextField>

            <TextField
              type="date"
              size="small"
              label="पासून दिनांक"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              type="date"
              size="small"
              label="पर्यंत दिनांक"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />

            <Tooltip
              title={
                sortKey === 'newest'
                  ? 'नवीन दिनांक आधी'
                  : 'जुना दिनांक आधी'
              }
              arrow
            >
              <ToggleButtonGroup
                size="small"
                exclusive
                value={sortKey}
                onChange={(_, val: SortKey | null) => {
                  if (val) setSortKey(val)
                }}
                sx={{
                  height: 40,
                  '& .MuiToggleButton-root': {
                    px: 1.25,
                    border: '1px solid',
                    borderColor: 'divider',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: 12,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: '#fff',
                      '&:hover': { bgcolor: 'primary.dark' },
                    },
                  },
                }}
              >
                <ToggleButton value="newest" aria-label="Newest first">
                  <ArrowDownwardIcon fontSize="small" />
                  <Typography sx={{ ml: 0.5, fontSize: 12 }}>
                    नवीन
                  </Typography>
                </ToggleButton>
                <ToggleButton value="oldest" aria-label="Oldest first">
                  <ArrowUpwardIcon fontSize="small" />
                  <Typography sx={{ ml: 0.5, fontSize: 12 }}>
                    जुना
                  </Typography>
                </ToggleButton>
              </ToggleButtonGroup>
            </Tooltip>

            <Button
              size="small"
              startIcon={<GridOnIcon />}
              variant="outlined"
              color="success"
              onClick={handleExcel}
              sx={{ fontWeight: 700, py: 1 }}
            >
              Excel
            </Button>

            <Button
              size="small"
              startIcon={
                pdfLoading ? (
                  <CircularProgress size={16} />
                ) : (
                  <PictureAsPdfIcon />
                )
              }
              variant="outlined"
              color="error"
              onClick={handlePdf}
              disabled={pdfLoading}
              sx={{ fontWeight: 700, py: 1 }}
            >
              {pdfLoading ? 'PDF...' : 'PDF'}
            </Button>
          </Box>

          {(dateFrom || dateTo) && (
            <Box
              sx={{ mt: 1.25, display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                size="small"
                variant="text"
                color="inherit"
                onClick={() => {
                  setDateFrom('')
                  setDateTo('')
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                ✕ दिनांक फिल्टर साफ करा
              </Button>
            </Box>
          )}
        </Paper>

        <UniversalTable<TableRow>
          data={filtered}
          columns={columns}
          loading={loading}
          rowsPerPage={10}
          tableSize="small"
          sortOrder="newer"
          stickyHeader
          maxHeight={600}
          caption="गणेशमूर्ती मंडळ माहिती नोंदणी २०२६"
          emptyStateMessage="कोणतीही नोंद आढळली नाही."
          actions={{
            view: (row) => openView(row),
            edit: (row) => openEditDirect(row),
            delete: (row) => {
              void handleDelete(row)
            },
          }}
        />

        <AdminMandalForm
          open={formOpen}
          mode={formMode}
          recordId={editingRecord?.id}
          initialValues={initialFormValues}
          onClose={() => setFormOpen(false)}
          onSaved={() => {
            void loadRecords()
          }}
        />

        <AdminViewMandal
          open={viewOpen}
          record={viewRecord}
          loading={deleting}
          onClose={() => {
            setViewOpen(false)
            setViewRecord(null)
          }}
          onEdit={handleEditFromView}
          onDelete={(row) => {
            void handleDelete(row)
          }}
        />
      </Container>
    </Box>
  )
}

export default AdminDashboard