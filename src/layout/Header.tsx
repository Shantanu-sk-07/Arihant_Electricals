import { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Avatar,
  Drawer, List, ListItemButton, ListItemText, Divider, useMediaQuery,
  useTheme, Stack, Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  Bolt as BoltIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { BRAND } from '@/constants/Brand';
import ThemeModeToggle from './ThemeModeToggle';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Media', to: '/media' },
  { label: 'Contact', to: '/contact' },
];

export default function Header() {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const siteName = settings.site_name || 'Arihant Electricals';
  const logo = settings.logo_url;
  const whatsapp = settings.whatsapp_1 || '917774855501';

  const handleNav = () => setOpen(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          backdropFilter: 'blur(12px)',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary',
          px: { xs: 0, md: 5 },
        }}
      >
        <Toolbar sx={{ py: { xs: 1, md: 1.5 }, px: { xs: 2, md: 4 } }}>
          {/* LOGO */}
          <Stack
            component={RouterLink}
            to="/"
            direction="row"
            spacing={1.5}
            sx={{
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              flexGrow: { xs: 1, md: 0 },
              minWidth: 0,
            }}
          >
            {logo ? (
              <Avatar
                src={logo}
                alt={siteName}
                sx={{
                  width: 40,
                  height: 40,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                A
              </Box>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '0.76rem', sm: '1rem', md: '1.15rem' },
                color: 'text.primary',
                letterSpacing: '-0.02em',
                minWidth: 0,
              }}
              noWrap
            >
              {siteName}
            </Typography>
          </Stack>

          {/* DESKTOP NAV */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', gap: 0.5 }}>
              {NAV.map((n) => {
                const active = pathname === n.to;
                return (
                  <Button
                    key={n.to}
                    component={RouterLink}
                    to={n.to}
                    sx={{
                      color: active ? 'primary.main' : 'text.primary',
                      fontWeight: active ? 700 : 500,
                      fontSize: '0.9rem',
                      px: 1.5,
                      position: 'relative',
                      '&::after': active
                        ? {
                            content: '""',
                            position: 'absolute',
                            bottom: 4,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60%',
                            height: 2,
                            bgcolor: BRAND.primary,
                            borderRadius: 1,
                          }
                        : {},
                      '&:hover': { color: BRAND.primary, bgcolor: `${BRAND.primary}08` },
                    }}
                  >
                    {n.label}
                  </Button>
                );
              })}
              <Button
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="contained"
                startIcon={<WhatsAppIcon />}
                sx={{
                  ml: 2,
                  bgcolor: BRAND.success,
                  px: 2.5,
                  py: 1,
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  boxShadow: `0 6px 20px ${BRAND.success}40`,
                  '&:hover': { bgcolor: '#128C4A', transform: 'translateY(-1px)' },
                }}
              >
                WhatsApp
              </Button>
              <ThemeModeToggle />
            </Box>
          )}

          {/* MOBILE HAMBURGER */}
          {isMobile && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 'auto', alignItems: 'center' }}>
              <ThemeModeToggle />
              <IconButton
                onClick={() => setOpen(true)}
                sx={{ color: 'text.primary' }}
                aria-label="Open menu"
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '85%', sm: 320 },
            background: `linear-gradient(180deg, ${BRAND.dark} 0%, ${BRAND.primaryDark} 100%)`,
            color: 'white',
          },
        }}
      >
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Menu
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: 'white' }} aria-label="Close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)' }} />

        <List sx={{ p: 2 }}>
          {NAV.map((n) => {
            const active = pathname === n.to;
            return (
              <ListItemButton
                key={n.to}
                component={RouterLink}
                to={n.to}
                onClick={handleNav}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <ListItemText
                  primary={n.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontWeight: active ? 700 : 500,
                        color: 'white',
                        fontSize: '1rem',
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ mt: 'auto', p: 3 }}>
          <Stack spacing={1.5}>
            {settings.phone_1 && (
              <Button
                fullWidth
                href={`tel:${settings.phone_1.replace(/\s/g, '')}`}
                startIcon={<PhoneIcon />}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.4)',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {settings.phone_1}
              </Button>
            )}
            <Button
              fullWidth
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              startIcon={<WhatsAppIcon />}
              variant="contained"
              sx={{ bgcolor: BRAND.success, '&:hover': { bgcolor: '#128C4A' } }}
            >
              Chat on WhatsApp
            </Button>
            <Chip
              icon={<BoltIcon sx={{ color: 'inherit !important' }} />}
              label={settings.tagline || 'Powering Maharashtra'}
              sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.75rem' }}
            />
          </Stack>
        </Box>
      </Drawer>
    </>
  );
}