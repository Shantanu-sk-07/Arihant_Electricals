import { Box, Container, Grid, Typography, Stack, Link, Divider, IconButton, Chip } from '@mui/material';
import {
  Phone as PhoneIcon, Email as EmailIcon, LocationOn as LocationIcon,
  Facebook as FacebookIcon, Instagram as InstagramIcon,
  YouTube as YouTubeIcon, LinkedIn as LinkedInIcon,
  WhatsApp as WhatsAppIcon, SolarPower as SolarIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useSettings } from '../hooks/useSettings';
import { BRAND } from '@/constants/Brand';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Media', to: '/media' },
  { label: 'Contact', to: '/contact' },
];

const SERVICES_LINKS = [
  'Solar Installation',
  'RTS Documentation',
  'Material Selling',
  'Subsidy Assistance',
  'Net Metering',
];

export default function Footer() {
  const { settings } = useSettings();
  const siteName = settings.site_name || 'Arihant Electricals';
  const year = new Date().getFullYear();

  const socials = [
    { icon: <FacebookIcon />, href: settings.facebook_url, label: 'Facebook' },
    { icon: <InstagramIcon />, href: settings.instagram_url, label: 'Instagram' },
    { icon: <YouTubeIcon />, href: settings.youtube_url, label: 'YouTube' },
    { icon: <LinkedInIcon />, href: settings.linkedin_url, label: 'LinkedIn' },
  ].filter((s) => s.href);

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, ${BRAND.dark} 0%, #061829 100%)`,
        color: 'white',
        pt: { xs: 6, md: 8 },
        pb: 3,
      }}
    >
      <Container>
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* BRAND */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SolarIcon sx={{ color: 'white', fontSize: 28 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
                {siteName}
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ opacity: 0.75, lineHeight: 1.7, mb: 2 }}>
              {settings.tagline || 'Powering Maharashtra with clean solar energy. Complete solar solutions — installation, RTS documentation, and material supply.'}
            </Typography>
            {settings.gst_number && (
              <Chip
                size="small"
                label={`GST: ${settings.gst_number}`}
                sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)', fontSize: '0.7rem' }}
              />
            )}

            {socials.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
                {socials.map((s) => (
                  <IconButton
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.08)',
                      color: 'white',
                      '&:hover': { bgcolor: BRAND.primary, transform: 'translateY(-2px)' },
                      transition: 'all 0.2s',
                    }}
                  >
                    {s.icon}
                  </IconButton>
                ))}
              </Stack>
            )}
          </Grid>

          {/* QUICK LINKS */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  component={RouterLink}
                  to={n.to}
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    '&:hover': { color: BRAND.secondary, pl: 0.5 },
                  }}
                >
                  {n.label}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* SERVICES */}
          <Grid size={{ xs: 6, md: 2.5 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Services
            </Typography>
            <Stack spacing={1}>
              {SERVICES_LINKS.map((s) => (
                <Typography
                  key={s}
                  sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}
                >
                  {s}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* CONTACT */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: '1rem' }}>
              Contact Us
            </Typography>
            <Stack spacing={2}>
              {settings.phone_1 && (
                <Stack direction="row" spacing={1.5}>
                  <PhoneIcon sx={{ fontSize: 20, color: BRAND.secondary, mt: 0.25 }} />
                  <Box>
                    <Link
                      href={`tel:${settings.phone_1.replace(/\s/g, '')}`}
                      sx={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}
                    >
                      {settings.phone_1}
                    </Link>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {settings.phone_1_name}
                    </Typography>
                  </Box>
                </Stack>
              )}
              {settings.phone_2 && (
                <Stack direction="row" spacing={1.5}>
                  <PhoneIcon sx={{ fontSize: 20, color: BRAND.secondary, mt: 0.25 }} />
                  <Box>
                    <Link
                      href={`tel:${settings.phone_2.replace(/\s/g, '')}`}
                      sx={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', display: 'block' }}
                    >
                      {settings.phone_2}
                    </Link>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {settings.phone_2_name}
                    </Typography>
                  </Box>
                </Stack>
              )}
              {settings.email && (
                <Stack direction="row" spacing={1.5}>
                  <EmailIcon sx={{ fontSize: 20, color: BRAND.secondary, mt: 0.25 }} />
                  <Link
                    href={`mailto:${settings.email}`}
                    sx={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: BRAND.secondary } }}
                  >
                    {settings.email}
                  </Link>
                </Stack>
              )}
              {settings.address && (
                <Stack direction="row" spacing={1.5}>
                  <LocationIcon sx={{ fontSize: 20, color: BRAND.secondary, mt: 0.25 }} />
                  <Typography sx={{ opacity: 0.85, fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {settings.address}
                  </Typography>
                </Stack>
              )}
              <Link
                href={`https://wa.me/${settings.whatsapp_1 || '917774855501'}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  bgcolor: BRAND.success,
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: 'fit-content',
                  '&:hover': { bgcolor: '#128C4A' },
                }}
              >
                <WhatsAppIcon sx={{ fontSize: 18 }} />
                Chat on WhatsApp
              </Link>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.12)' }} />

       <Stack
  direction={{ xs: 'column', md: 'row' }}
  spacing={{ xs: 2, md: 0 }}
  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
>
  <Typography
    component={RouterLink}
    to="/admin/login"
    variant="caption"
    sx={{
      opacity: 0.7,
      color: 'inherit',
      textDecoration: 'none',
      transition: 'all 0.2s',
      '&:hover': {
        opacity: 1,
        color: BRAND.secondary,
      },
    }}
  >
    © {year} {siteName}. All rights reserved.
  </Typography>
  <Typography variant="caption" sx={{ opacity: 0.7 }}>
    Made with ⚡ in Maharashtra
  </Typography>
</Stack>
      </Container>
    </Box>
  );
}