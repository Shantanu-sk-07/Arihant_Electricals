import { useState, useEffect } from 'react';
import {
  Box, Drawer, List, ListItemButton, ListItemText, Toolbar,
  Typography, IconButton, useMediaQuery, useTheme, Divider,
  Stack, Avatar, MenuItem, MenuList, AppBar, Popover,
} from '@mui/material';
import {
  Menu as MenuIcon, Logout as LogoutIcon,
  Home as HomeIcon, MiscellaneousServices as ServicesIcon,
  Payments as PaymentsIcon, Star as StarIcon,
  PhotoLibrary as MediaIcon, MoreHoriz as ExtraIcon,
} from '@mui/icons-material';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { BRAND } from '@/constants/Brand';
import ThemeModeToggle from './ThemeModeToggle';
import { showSnackbar, showConfirmation } from '@/components/ToastMessage';
import { useSettings } from '@/hooks/useSettings';
import AdminContentSearch from './AdminContentSearch';

const DRAWER_WIDTH = 260;

const ITEMS = [
  { to: '/admin/basic', label: 'Basic Details', icon: <HomeIcon /> },
  { to: '/admin/services', label: 'Services', icon: <ServicesIcon /> },
  { to: '/admin/pricing', label: 'Pricing', icon: <PaymentsIcon /> },
  { to: '/admin/media', label: 'Media', icon: <MediaIcon /> },
  { to: '/admin/benefits', label: 'Benefits & Testimonials', icon: <StarIcon /> },
  { to: '/admin/extra', label: 'Extra Details', icon: <ExtraIcon /> },
];

export default function AdminLayout() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { settings } = useSettings();

  const siteName = settings.site_name || 'Arihant Electricals';
  const logoUrl = settings.logo_url;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? '');
    });
  }, []);

  const logout = async () => {
    setAnchorEl(null);
    const ok = await showConfirmation({
      message: 'Are you sure you want to sign out?',
      title: 'Confirm Logout',
      confirmText: 'Logout',
      confirmColor: 'error',
      icon: <LogoutIcon />,
    });
    if (!ok) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      nav('/');
    } catch (error) {
      showSnackbar('error', error instanceof Error ? error.message : 'Unable to sign out.');
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
     <Toolbar
  sx={{
    bgcolor: 'background.paper',
    color: 'text.primary',
    borderBottom: 1,
    borderColor: 'divider',
    minHeight: 72,
  }}
>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', width: '100%' }}>
          {logoUrl ? (
            <Avatar
              src={logoUrl}
              alt={siteName}
              sx={{
                width: 42,
                height: 42,
                bgcolor: 'white',
                flexShrink: 0,
              }}
            />
          ) : (
            <Avatar
              sx={{
                bgcolor: BRAND.accent,
                color: BRAND.dark,
                fontWeight: 800,
                width: 42,
                height: 42,
              }}
            >
              {siteName.charAt(0)}
            </Avatar>
          )}
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }} noWrap>
              {siteName}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', opacity: 0.8 }}>Admin Panel</Typography>
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
              <Box sx={{ mr: 1.5, display: 'flex', color: 'inherit' }}>{item.icon}</Box>
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
      <Box sx={{ p: 1.5 }}>
        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', textAlign: 'center' }}>
          © {new Date().getFullYear()} {siteName}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
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

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: 'background.paper',
            borderBottom: 1,
            borderColor: 'divider',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ gap: { xs: 0.5, sm: 1.5 }, px: { xs: 1, sm: 2, md: 3 } }}>
            {/* Mobile only: hamburger + logo/name (sidebar is hidden, so show here) */}
            {isMobile && (
              <>
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  aria-label="Open admin menu"
                  sx={{ color: 'text.primary' }}
                >
                  <MenuIcon />
                </IconButton>
                <Stack
                  direction="row"
                  spacing={{ xs: 0.75, sm: 1 }}
                  sx={{ alignItems: 'center', minWidth: 0, flexShrink: 0 }}
                >
                  <Avatar
                    src={logoUrl || undefined}
                    alt={siteName}
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: BRAND.primary,
                      color: 'white',
                      fontWeight: 700,
                    }}
                  >
                    {siteName.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      maxWidth: 120,
                      fontSize: '0.8rem',
                    }}
                    noWrap
                  >
                    {siteName}
                  </Typography>
                </Stack>
              </>
            )}

            {/* Search — centered on desktop, flexible on mobile */}
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                justifyContent: isMobile ? 'flex-end' : 'center',
                px: { xs: 0.5, sm: 2 },
              }}
            >
              <AdminContentSearch />
            </Box>

            {/* Right side: theme toggle + account avatar */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0, sm: 0.5 },
                flexShrink: 0,
              }}
            >
              <ThemeModeToggle />
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
                aria-label="Account menu"
                sx={{ p: 0.5 }}
              >
                <Avatar
                  src={logoUrl || undefined}
                  sx={{
                    width: { xs: 30, sm: 36 },
                    height: { xs: 30, sm: 36 },
                    bgcolor: BRAND.primary,
                    fontSize: '0.9rem',
                  }}
                >
                  {userEmail.charAt(0).toUpperCase() || 'A'}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              minWidth: 220,
              borderRadius: 2,
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              overflow: 'hidden',
            },
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
            Signed in as
          </Typography>
          <Typography sx={{ fontSize: '0.9rem', fontWeight: 600 }} noWrap>
            {userEmail || 'Admin'}
          </Typography>
        </Box>

        <MenuList sx={{ py: 0.5 }}>
          <MenuItem
            onClick={logout}
            sx={{
              py: 1.5,
              color: BRAND.error,
              '&:hover': { bgcolor: `${BRAND.error}10` },
            }}
          >
            <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
            Logout
          </MenuItem>
        </MenuList>
      </Popover>
    </Box>
  );
}