import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '@/i18n';
import { ThemeModeProvider } from './layout/ThemeModeProvider';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeModeProvider>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeModeProvider>
  </StrictMode>,
);