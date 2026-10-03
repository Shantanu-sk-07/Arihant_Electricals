import { useState } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemText, Toolbar,
  Typography, Button, AppBar, IconButton, useMediaQuery, useTheme,
  Divider, Stack, Avatar, CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard as DashboardIcon,
  Home as HomeIcon, Info as InfoIcon,
  MiscellaneousServices as ServicesIcon, Payments as PaymentsIcon,
  TrendingUp as BenefitsIcon, Star as StarIcon,
  PhotoLibrary as MediaIcon, Mail as MailIcon,
  Settings as SettingsIcon, Logout as LogoutIcon,
  EditNote as ContentIcon,
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BRAND } from '@/constants/Brand';
import ThemeModeToggle from './ThemeModeToggle';
import { showSnackbar } from '@/components/ToastMessage';

const DRAWER_WIDTH = 260;

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/content', label: 'Website Content', icon: <ContentIcon /> },
  { to: '/admin/home', label: 'Home Content', icon: <HomeIcon /> },
  { to: '/admin/about', label: 'About Content', icon: <InfoIcon /> },
  { to: '/admin/services', label: 'Services', icon: <ServicesIcon /> },
  { to: '/admin/pricing', label: 'Pricing', icon: <PaymentsIcon /> },
  { to: '/admin/benefits', label: 'Why Solar', icon: <BenefitsIcon /> },
  { to: '/admin/testimonials', label: 'Testimonials', icon: <StarIcon /> },
  { to: '/admin/media', label: 'Media', icon: <MediaIcon /> },
  { to: '/admin/contacts', label: 'Contacts', icon: <MailIcon /> },
  { to: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const logout = async () => {
    setLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      nav('/');
    } catch (error) {
      showSnackbar('error', error instanceof Error ? error.message : 'Unable to sign out.');
    } finally {
      setLoggingOut(false);
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.primaryDark} 100%)`,
          color: 'white',
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: BRAND.accent,
              color: BRAND.dark,
              fontWeight: 800,
              width: 36,
              height: 36,
            }}
          >
            A
          </Avatar>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>
              Arihant Admin
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
              Control Panel
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <List sx={{ flexGrow: 1, py: 1 }}>
        {ITEMS.map((item) => {
          const active = pathname === item.to;
          return (
            <ListItemButton
              key={item.to}
              component={Link}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              sx={{
                mx: 1,
                my: 0.25,
                borderRadius: 2,
                color: active ? 'primary.contrastText' : 'text.secondary',
                bgcolor: active ? 'primary.main' : 'transparent',
                '&:hover': {
                  bgcolor: active ? 'primary.dark' : 'action.hover',
                  color: active ? 'primary.contrastText' : 'primary.main',
                },
              }}
            >
              <Box sx={{ mr: 1.5, display: 'flex', color: 'inherit' }}>
                {item.icon}
              </Box>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontWeight: active ? 700 : 500, fontSize: '0.9rem' } },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={loggingOut ? <CircularProgress size={18} color="inherit" /> : <LogoutIcon />}
          onClick={logout}
          disabled={loggingOut}
          sx={{
            borderColor: BRAND.error,
            color: BRAND.error,
            fontWeight: 600,
            '&:hover': { bgcolor: `${BRAND.error}10`, borderColor: BRAND.error },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* MOBILE TOP BAR */}
      {isMobile && (
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar>
            <IconButton
              onClick={() => setMobileOpen(true)}
              aria-label="Open admin menu"
              sx={{ color: 'text.primary' }}
            >
              <MenuIcon />
            </IconButton>
            <Typography sx={{ ml: 2, fontWeight: 700 }}>Admin Panel</Typography>
            <Box sx={{ ml: 'auto' }}><ThemeModeToggle /></Box>
          </Toolbar>
        </AppBar>
      )}

      {/* MOBILE DRAWER */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* DESKTOP PERMANENT DRAWER */
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              borderRight: `1px solid ${BRAND.light}`,
              bgcolor: 'background.paper',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          bgcolor: 'background.default',
          minHeight: '100vh',
          mt: { xs: 8, md: 0 },
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {!isMobile && (
          <Stack direction="row" sx={{ mb: 1, justifyContent: 'flex-end' }}>
            <ThemeModeToggle />
          </Stack>
        )}
        <Outlet />
      </Box>
    </Box>
  );
}