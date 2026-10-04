import { Box, Container, Grid, Typography, Card, CardContent, Stack, Button, Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle, ArrowForward, Phone } from '@mui/icons-material';
import { useServices } from '../hooks/useServices';
import { useSettings } from '../hooks/useSettings';
import { useContent } from '../hooks/useContent';
import { BRAND, SHADOW } from '@/constants/Brand';
import { getMappedIcon } from '../utils/IconMapping';

export default function Services() {
  const { services, loading } = useServices();
  const { settings } = useSettings();
  const { content } = useContent('services');

  return (
    <Box>
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(32,49,40,.94), rgba(85,122,70,.8)), url("${content['hero.image'] || 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2000&q=85'}") center/cover`,
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
              mb: 2,
              letterSpacing: '-0.02em',
            }}
          >
            {content['hero.title'] || 'Our Solar Services'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720, mx: 'auto' }}>
            {content['hero.subtitle'] || 'Complete solar solutions for Maharashtra — from installation to subsidy paperwork.'}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 10 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: BRAND.primary }} />
          </Box>
        ) : (
          <Stack spacing={{ xs: 4, md: 8 }}>
            {services.filter((s) => s.is_active).map((s, i) => (
              <Card
                key={s.id}
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                sx={{
                  border: `1px solid ${BRAND.light}`,
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  '&:hover': { boxShadow: SHADOW.cardHover },
                }}
              >
                <Grid container>
                  <Grid
                    size={{ xs: 12, md: 5 }}
                    sx={{
                      order: { xs: 2, md: i % 2 === 0 ? 1 : 2 },
                      background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
                      color: 'white',
                      p: { xs: 4, md: 6 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 3,
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <Box sx={{ '& svg': { fontSize: 40 } }}>{getMappedIcon(s.icon ?? 'solar_power')}</Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
                      {s.title}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.7 }}>
                      {s.short_description}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 12, md: 7 }} sx={{ order: { xs: 1, md: i % 2 === 0 ? 2 : 1 } }}>
                    <CardContent sx={{ p: { xs: 4, md: 6 } }}>
                      <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 3 }}>
                        {s.full_description || s.short_description}
                      </Typography>

                      {s.features && s.features.length > 0 && (
                        <>
                          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 2 }}>
                            What's Included
                          </Typography>
                          <Grid container spacing={1.5}>
                            {s.features.map((f) => (
                              <Grid size={{ xs: 12, sm: 6 }} key={f}>
                                <Stack direction="row" sx={{spacing:1, alignItems:"flex-start"}}>
                                  <CheckCircle
                                    sx={{ fontSize: 20, color: BRAND.success, mt: '2px', flexShrink: 0 }}
                                  />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {f}
                                  </Typography>
                                </Stack>
                              </Grid>
                            ))}
                          </Grid>
                        </>
                      )}

                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4 }}>
                        <Button
                          component={RouterLink}
                          to="/contact"
                          variant="contained"
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: BRAND.primary,
                            py: 1.2,
                            px: 3,
                            '&:hover': { bgcolor: BRAND.primaryDark },
                          }}
                        >
                          Get Quote
                        </Button>
                        <Button
                          href={`tel:${settings.phone_1?.replace(/\s/g, '') || '+917774855501'}`}
                          variant="outlined"
                          startIcon={<Phone />}
                          sx={{
                            borderColor: BRAND.primary,
                            color: BRAND.primary,
                            py: 1.2,
                            px: 3,
                            '&:hover': { bgcolor: `${BRAND.primary}10` },
                          }}
                        >
                          Call Now
                        </Button>
                      </Stack>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            ))}

            {!services.length && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  No services available yet.
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </Container>

      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'action.hover' }}>
        <Container>
          <Card sx={{ p: { xs: 3, md: 5 }, textAlign: 'center', bgcolor: 'primary.dark', color: 'primary.contrastText' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
              {content['cta.title'] || 'Not sure which service you need?'}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              {content['cta.subtitle'] || "Talk to our experts — we'll guide you to the right solar solution."}
            </Typography>
            <Chip
              component="a"
              href={`https://wa.me/${settings.whatsapp_1 || '917774855501'}`}
              target="_blank"
              rel="noopener noreferrer"
              label={content['cta.button'] || 'Chat on WhatsApp'}
              clickable
              sx={{
                bgcolor: BRAND.accent,
                color: BRAND.dark,
                fontWeight: 700,
                py: 3,
                px: 4,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#E5A200' },
              }}
            />
          </Card>
        </Container>
      </Box>
    </Box>
  );
}