import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF6B35',      // vibrant fresh orange
      dark: '#D94F1E',      // deeper burnt orange (hover / active)
      light: '#FF9066',     // soft peachy orange (hover glow)
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FF4D8D',      // fresh pink (accents, gradients)
      dark: '#D63172',      // deeper rose pink
      light: '#FF80AC',     // soft blush pink
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFF7F2',   // warm pinkish white (page bg)
      paper: '#FFFFFF',     // pure white (cards, tables)
    },
    text: {
      primary: '#2B1B14',   // warm dark brown-black (readable)
      secondary: '#7A5C4D', // muted warm brown
    },
    error:   { main: '#E53935' },
    warning: { main: '#FFA726' },
    success: { main: '#2E9E5B' },
    info:    { main: '#5C9EFF' },
    divider: 'rgba(255, 107, 53, 0.12)', // orange-tinted dividers
  },
  typography: {
    fontFamily: [
      '"Noto Sans Devanagari"',
      '"Nirmala UI"',
      '"Mangal"',
      'system-ui',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 800 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          paddingTop: 10,
          paddingBottom: 10,
          borderRadius: 10,
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: 'small' },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#FFF1EA', // soft peachy header
          color: '#2B1B14',
          fontWeight: 700,
        },
      },
    },
  },
})

export default theme