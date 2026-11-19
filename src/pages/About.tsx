import { Box, Container, Grid, Typography, Card, CardContent, Avatar, Stack, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircle, EmojiEvents, Visibility, Flag, Groups } from '@mui/icons-material';
import { useContent } from '../hooks/useContent';
import { useSettings } from '../hooks/useSettings';
import SectionTitle from '../components/SectionTitle';
import { BRAND } from '@/constants/Brand';

export default function About() {
  const { content } = useContent('about');
  const { settings } = useSettings();

  const team = [
    {
      name: settings.phone_1_name || 'Suraj Kumbhar',
      role: settings.team_1_role || 'Founder & Director',
      phone: settings.phone_1,
    },
    {
      name: settings.phone_2_name || 'Neeraj Patil',
      role: settings.team_2_role || 'Co-Founder & Operations Head',
      phone: settings.phone_2,
    },
  ];

  return (
    <Box>
      <Box sx={{ background: `linear-gradient(135deg, rgba(9,39,71,.92), rgba(23,101,179,.72)), url("${content['hero.image'] || 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=2000'}") center/cover`, color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, letterSpacing: '-0.02em' }}>
            {content['hero.title'] || content['intro.title'] || 'Solar energy, made personal.'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720, mx: 'auto' }}>
            {content['hero.subtitle'] || 'A local solar team helping homes and businesses make a confident switch to cleaner energy.'}
          </Typography>
        </Container>
      </Box>

      {/* STORY */}
      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component={motion.div} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Chip label={content['story.eyebrow'] || 'Our Story'} sx={{ bgcolor: `${BRAND.primary}15`, color: BRAND.primary, fontWeight: 700, mb: 2 }} />
              <Typography variant="h3" sx={{ fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.25rem' }, color: 'text.primary', mb: 3, lineHeight: 1.2 }}>
                {content['story.title'] || 'A dependable team for your move to solar.'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, mb: 2, whiteSpace: 'pre-line' }}>
                {content['intro.body'] ||
                  'Arihant Electricals helps homes and businesses explore rooftop solar with practical advice, thoughtful system design, and hands-on installation support. We make the process easier to understand, from the first roof assessment to getting your system up and running.'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                {content['story.supporting_body'] || 'Our team can also guide you through the documentation and coordination involved, so you have a clear point of contact throughout your solar journey.'}
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box component="img" src={content['story.image'] || 'https://images.pexels.com/photos/9875448/pexels-photo-9875448.jpeg?auto=compress&cs=tinysrgb&w=1300'} alt="Solar panels installed on a rooftop under the open sky" sx={{ width: '100%', height: { xs: 240, md: 300 }, objectFit: 'cover', borderRadius: 3, mb: 2 }} />
            <Grid container spacing={2}>
              {[
                { value: settings.stat_installations || '500+', label: 'Installations' },
                { value: settings.stat_capacity || '2 MW+', label: 'Capacity' },
                { value: settings.stat_experience || '10+', label: 'Years' },
                { value: settings.stat_subsidy || '₹78K', label: 'Max Subsidy' },
              ].map((s, i) => (
                <Grid size={6} key={s.label}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    sx={{ p: 3, textAlign: 'center', border: `1px solid ${BRAND.light}` }}
                  >
                    <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' }, color: BRAND.primary, lineHeight: 1, mb: 0.5 }}>
                      {s.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>{s.label}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* MISSION / VISION */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'action.hover' }}>
        <Container>
          <SectionTitle eyebrow={content['purpose.eyebrow'] || 'WHAT GUIDES US'} title={content['purpose.title'] || 'Good solar starts with good people.'} subtitle={content['purpose.subtitle'] || 'We believe clean energy should be simple to understand and dependable for the long run.'} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} sx={{ height: '100%', p: 2, border: `1px solid ${BRAND.light}` }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: `${BRAND.primary}15`, color: BRAND.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Flag sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>{content['mission.title'] || 'Our Mission'}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {content['mission.body'] || 'Help more households and businesses adopt rooftop solar with clear advice, dependable installation, and responsive support.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} sx={{ height: '100%', p: 2, border: `1px solid ${BRAND.light}` }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: `${BRAND.secondary}15`, color: BRAND.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <Visibility sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>{content['vision.title'] || 'Our Vision'}</Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                    {content['vision.body'] || 'Build a future where clean rooftop energy is an easy, trusted choice for communities across Maharashtra.'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Card component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} sx={{ height: '100%', p: 2, border: `1px solid ${BRAND.light}` }}>
                <CardContent>
                  <Box sx={{ width: 64, height: 64, borderRadius: 3, bgcolor: `${BRAND.success}15`, color: BRAND.success, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <CheckCircle sx={{ fontSize: 32 }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5 }}>{content['why.title'] || 'Why Choose Us'}</Typography>
                  <Stack spacing={1}>
                    {(content['why.items'] || 'Guidance from assessment to installation\nTransparent system recommendations\nQuality solar equipment\nSupport after your system is switched on').split('\n').filter(Boolean).map((f) => (
                      <Stack key={f} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                        <CheckCircle sx={{ fontSize: 18, color: BRAND.success }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{f}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* TEAM */}
      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <SectionTitle eyebrow={content['team.eyebrow'] || 'MEET YOUR SOLAR TEAM'} title={content['team.title'] || 'The people behind your project.'} subtitle={content['team.subtitle'] || 'Real people, ready to help you make a confident switch to rooftop solar.'} />
        <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
          {team.map((t, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={t.name}>
              <Card component={motion.div} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} sx={{ p: 4, textAlign: 'center', border: `1px solid ${BRAND.light}` }}>
                <Avatar sx={{ width: 100, height: 100, bgcolor: BRAND.primary, fontSize: '2.5rem', fontWeight: 700, mx: 'auto', mb: 2 }}>
                  {t.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>{t.name}</Typography>
                <Typography variant="body2" sx={{ color: BRAND.primary, fontWeight: 600, mb: 1 }}>{t.role}</Typography>
                {t.phone && <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.phone}</Typography>}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CERTIFICATIONS */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'action.hover' }}>
        <Container>
          <SectionTitle eyebrow={content['certifications.eyebrow'] || 'Certifications'} title={content['certifications.title'] || 'Trusted & Certified'} />
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            {(content['certifications.items'] || 'MNRE Registered\nGST Verified\nBIS Certified Products\nTop Brand Dealer')
              .split('\n')
              .filter(Boolean)
              .map((label, i) => ({ icon: [<EmojiEvents />, <CheckCircle />, <Groups />][i % 3], label }))
              .map((c, i) => (
              <Grid size={{ xs: 6, md: 3 }} key={c.label}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  sx={{ p: 3, textAlign: 'center', border: `1px solid ${BRAND.light}` }}
                >
                  <Box sx={{ color: BRAND.primary, mb: 1 }}>{c.icon}</Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{c.label}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}