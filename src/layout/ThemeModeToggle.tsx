import { IconButton, Tooltip } from '@mui/material';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useThemeMode } from './ThemeModeProvider';

export default function ThemeModeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Tooltip title={`Switch to ${isDark ? 'light' : 'dark'} mode`}>
      <IconButton
        onClick={toggleMode}
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        color="inherit"
        size="small"
      >
        {isDark ? <LightMode /> : <DarkMode />}
      </IconButton>
    </Tooltip>
  );
}
