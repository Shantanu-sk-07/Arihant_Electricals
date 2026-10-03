import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from '@/layout/Header';
import Footer from '@/layout/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ScrollToTop from '@/components/ScrollToTop';

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Header />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
      <WhatsAppButton />
    </Box>
  );
}