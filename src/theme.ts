import { createTheme, type PaletteMode } from '@mui/material/styles';
import { BRAND } from './constants/Brand';

export function createSolarTheme(mode: PaletteMode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: dark ? '#A8C987' : BRAND.primary,
        light: dark ? '#C2D9AA' : BRAND.primaryLight,
        dark: dark ? '#77985B' : BRAND.primaryDark,
        contrastText: dark ? '#172319' : '#FFFFFF',
      },
      secondary: {
        main: BRAND.secondary,
        contrastText: BRAND.dark,
      },
      success: { main: BRAND.success },
      warning: { main: BRAND.accent },
      error: { main: BRAND.error },
      background: {
        default: dark ? '#131B17' : '#F8F8F2',
        paper: dark ? '#1D2821' : '#FFFFFF',
      },
      text: {
        primary: dark ? '#F0F2E9' : BRAND.dark,
        secondary: dark ? '#B5C0B7' : '#68756B',
      },
      divider: dark ? 'rgba(230,238,228,0.12)' : 'rgba(32,49,40,0.12)',
    },
    shape: { borderRadius: 16 },
    typography: {
      fontFamily: '"Inter", "Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      button: { textTransform: 'none', fontWeight: 700 },
      h1: { fontWeight: 800, letterSpacing: '-0.035em' },
      h2: { fontWeight: 800, letterSpacing: '-0.03em' },
      h3: { fontWeight: 800, letterSpacing: '-0.025em' },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            minWidth: 320,
            backgroundColor: dark ? '#131B17' : '#F8F8F2',
            transition: 'background-color 180ms ease, color 180ms ease',
          },
          '::selection': {
            backgroundColor: dark ? 'rgba(168,201,135,.35)' : 'rgba(85,122,70,.2)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '*, *::before, *::after': {
              scrollBehavior: 'auto !important',
              animationDuration: '0.01ms !important',
              animationIterationCount: '1 !important',
              transitionDuration: '0.01ms !important',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
            '&:hover': { transform: 'translateY(-1px)' },
            '&.MuiButton-containedPrimary': {
              boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,.24)'
              : '0 8px 24px rgba(85,122,70,.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: 'none',
            boxShadow: dark
              ? '0 12px 32px rgba(0,0,0,.2)'
              : '0 12px 32px rgba(32,49,40,.07)',
            transition: 'transform 220ms ease, box-shadow 220ms ease, background-color 180ms ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTextField: {
        defaultProps: { variant: 'outlined' },
      },
    },
  });
}
