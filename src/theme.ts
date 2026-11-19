import { createTheme, type PaletteMode } from '@mui/material/styles';
import { BRAND } from './constants/Brand';

export function createSolarTheme(mode: PaletteMode) {
  const dark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: dark ? '#83C6F1' : BRAND.primary,
        light: dark ? '#B7DFF8' : BRAND.primaryLight,
        dark: dark ? '#4A91D2' : BRAND.primaryDark,
        contrastText: dark ? '#10263B' : '#FFFFFF',
      },
      secondary: {
        main: BRAND.secondary,
        contrastText: BRAND.dark,
      },
      success: { main: BRAND.success },
      warning: { main: BRAND.accent },
      error: { main: BRAND.error },
      background: {
        default: dark ? '#101D2A' : '#F7FAFD',
        paper: dark ? '#192A3A' : '#FFFFFF',
      },
      text: {
        primary: dark ? '#F0F6FB' : BRAND.dark,
        secondary: dark ? '#B4C4D3' : '#63778A',
      },
      divider: dark ? 'rgba(230,240,249,0.12)' : 'rgba(18,49,79,0.12)',
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
            backgroundColor: dark ? '#101D2A' : '#F7FAFD',
            transition: 'background-color 180ms ease, color 180ms ease',
          },
          '::selection': {
            backgroundColor: dark ? 'rgba(131,198,241,.35)' : 'rgba(23,101,179,.18)',
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
            borderRadius: 10,
            transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
            '&:hover': { transform: 'translateY(-1px)' },
            '&:active': { transform: 'scale(0.98)' },
            '&.MuiButton-containedPrimary': {
              boxShadow: dark
              ? '0 8px 24px rgba(0,0,0,.24)'
              : '0 8px 24px rgba(23,101,179,.2)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            border: `1px solid ${dark ? 'rgba(230,240,249,0.10)' : 'rgba(18,49,79,0.08)'}`,
            boxShadow: dark
              ? '0 6px 20px rgba(0,0,0,.18)'
              : '0 6px 20px rgba(18,49,79,.06)',
            transition: 'box-shadow 220ms ease, background-color 180ms ease',
            '&:hover': {
              boxShadow: dark
                ? '0 12px 30px rgba(0,0,0,.3)'
                : '0 12px 30px rgba(18,49,79,.12)',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'transform 180ms ease, background-color 180ms ease',
            '&:hover': { transform: 'scale(1.06)' },
            '&:active': { transform: 'scale(0.94)' },
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