import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ThemeProvider, type PaletteMode } from '@mui/material/styles';
import { createSolarTheme } from '../theme';

interface ThemeModeContextValue {
  mode: PaletteMode;
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);
const STORAGE_KEY = 'arihant-color-mode';

function getInitialMode(): PaletteMode {
  const storedMode = window.localStorage.getItem(STORAGE_KEY);
  return storedMode === 'dark' ? 'dark' : 'light';
}

export function ThemeModeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<PaletteMode>(getInitialMode);
  const toggleMode = useCallback(() => {
    setMode((currentMode) => {
      const nextMode = currentMode === 'light' ? 'dark' : 'light';
      window.localStorage.setItem(STORAGE_KEY, nextMode);
      return nextMode;
    });
  }, []);
  const theme = useMemo(() => createSolarTheme(mode), [mode]);
  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within ThemeModeProvider');
  }
  return context;
}
