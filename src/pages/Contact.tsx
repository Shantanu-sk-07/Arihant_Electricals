import {
  Box, Container, Grid, Typography, Card, Stack,
  Button, CircularProgress,
} from '@mui/material';
import { Phone, Email, LocationOn, WhatsApp, Send, AccessTime } from '@mui/icons-material';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSettings } from '../hooks/useSettings';
import TextInputField from '../components/TextInputField';
import EmailField from '../components/EmailField';
import MobileField from '../components/MobileField';
import SectionTitle from '../components/SectionTitle';
import { FormProvider, useForm } from 'react-hook-form';
import { BRAND, SHADOW } from '@/constants/Brand';
import { useContent } from '@/hooks/useContent';
import { showSnackbar } from '@/components/ToastMessage';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const { settings } = useSettings();
  const { content } = useContent('contact');
  const [submitting, setSubmitting] = useState(false);

  const methods = useForm<ContactForm>({
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const submit = async (data: ContactForm) => {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contacts').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      });
      if (error) throw error;
      showSnackbar('success', content['form.success_message'] || "Thanks! We'll get back to you within 24 hours.");
      methods.reset();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to send your message.';
      showSnackbar('error', message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Box sx={{ background: `linear-gradient(135deg, rgba(32,49,40,.94), rgba(85,122,70,.8)), url("${content['hero.image'] || 'https://images.unsplash.com/photo-1509391366360-2e959784e9e8?auto=format&fit=crop&w=2000&q=85'}") center/cover`, color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
            {content['hero.title'] || 'Get in Touch'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720, mx: 'auto' }}>
            {content['hero.subtitle'] || 'Book a free site survey or ask us anything about solar.'}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={5}>
          {/* Contact Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={3}>
              <Card sx={{ p: 3, border: `1px solid ${BRAND.light}` }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${BRAND.primary}15`, color: BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>Call Us</Typography>
                    <Typography component="a" href={`tel:${settings.phone_1?.replace(/\s/g, '') || '+917774855501'}`} sx={{ display: 'block', color: 'text.primary', fontWeight: 700, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      {settings.phone_1 || '+91 77748 55501'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{settings.phone_1_name || 'Suraj Kumbhar'}</Typography>

                    <Typography component="a" href={`tel:${settings.phone_2?.replace(/\s/g, '') || '+919767334454'}`} sx={{ display: 'block', mt: 1.5, color: 'text.primary', fontWeight: 700, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      {settings.phone_2 || '+91 97673 34454'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{settings.phone_2_name || 'Neeraj Patil'}</Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, border: `1px solid ${BRAND.light}` }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${BRAND.secondary}15`, color: BRAND.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Email />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>Email Us</Typography>
                    <Typography component="a" href={`mailto:${settings.email}`} sx={{ color: 'text.primary', fontWeight: 700, textDecoration: 'none', '&:hover': { color: 'primary.main' } }}>
                      {settings.email || 'info@arihantelectricals.com'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, border: `1px solid ${BRAND.light}` }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${BRAND.accent}15`, color: BRAND.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <LocationOn />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>Visit Us</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>
                      {settings.address || 'Maharashtra, India'}
                    </Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, border: `1px solid ${BRAND.light}` }}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: `${BRAND.success}15`, color: BRAND.success, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <AccessTime />
                  </Box>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600, mb: 0.5 }}>Working Hours</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 600 }}>Mon – Sat: 9 AM – 7 PM</Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Sunday: Closed</Typography>
                  </Box>
                </Stack>
              </Card>

              <Card sx={{ p: 3, background: `linear-gradient(135deg, ${BRAND.success}15 0%, ${BRAND.success}05 100%)`, border: `1px solid ${BRAND.success}30` }}>
                <Stack spacing={2}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    <WhatsApp sx={{ verticalAlign: 'middle', mr: 0.75, fontSize: 18 }} />
                    Prefer WhatsApp? Chat with us instantly.
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                    <Button
                      fullWidth
                      href={`https://wa.me/${settings.whatsapp_1 || '917774855501'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<WhatsApp />}
                      sx={{ bgcolor: BRAND.success, '&:hover': { bgcolor: '#128C4A' } }}
                    >
                      {settings.whatsapp_1_name || 'Suraj'}
                    </Button>
                    <Button
                      fullWidth
                      href={`https://wa.me/${settings.whatsapp_2 || '919767334454'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="contained"
                      startIcon={<WhatsApp />}
                      sx={{ bgcolor: BRAND.success, '&:hover': { bgcolor: '#128C4A' } }}
                    >
                      {settings.whatsapp_2_name || 'Neeraj'}
                    </Button>
                  </Stack>
                </Stack>
              </Card>
            </Stack>
          </Grid>

          {/* Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ p: { xs: 3, md: 5 }, border: `1px solid ${BRAND.light}`, boxShadow: SHADOW.card }}>
              <SectionTitle align="left" eyebrow={content['form.eyebrow'] || 'Send a Message'} title={content['form.title'] || 'Book Free Site Survey'} />
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(submit)}>
                  <Grid container spacing={2.5}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextInputField name="name" label="Your Name" required inputType="alphabet" minLength={2} maxLength={50} />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <EmailField name="email" label="Email Address" required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <MobileField name="phone" label="Phone Number" required />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextInputField name="message" label="Your Message" required inputType="all" rows={5} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <Send />}
                        sx={{
                          bgcolor: BRAND.primary,
                          py: 1.5,
                          fontWeight: 700,
                          fontSize: '1rem',
                          '&:hover': { bgcolor: BRAND.primaryDark },
                          '&.Mui-disabled': { bgcolor: '#94A3B8', color: 'white' },
                        }}
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </FormProvider>
            </Card>
          </Grid>
        </Grid>
      </Container>

    </Box>
  );
}