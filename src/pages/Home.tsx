import {
  ArrowForward,
  Bolt,
  CheckCircle,
  SolarPower,
  Star,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { useBenefits } from '../hooks/useBenefits';
import { useContent } from '../hooks/useContent';
import { usePricing } from '@/hooks/usePricing';
import { useServices } from '../hooks/useServices';
import { useSettings } from '../hooks/useSettings';
import { useTestimonials } from '../hooks/useTestimonials';
import SectionTitle from '../components/SectionTitle';
import { getMappedIcon } from '../utils/IconMapping';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1509391366360-2e959784e9e8?auto=format&fit=crop&w=2400&q=88';

const SERVICE_IMAGES = [
  'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1000&q=82',
];

const STEPS = [
  { title: 'A quick site visit', desc: 'We check your roof, usage and the best direction for your panels.' },
  { title: 'A system made for you', desc: 'Get a clear design and quote, sized around your home and your bills.' },
  { title: 'Installed with care', desc: 'Our trained crew fits quality equipment and gets your system connected.' },
  { title: 'We handle the paperwork', desc: 'From net metering to eligible subsidy support, we guide every step.' },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const { content } = useContent('home');
  const { settings } = useSettings();
  const { benefits } = useBenefits();
  const { services } = useServices();
  const { plans } = usePricing();
  const { testimonials } = useTestimonials();

  const stats = [
    { value: settings.stat_installations || '500+', label: content['stats.installation_label'] || 'Homes powered' },
    { value: settings.stat_capacity || '2 MW+', label: content['stats.capacity_label'] || 'Clean energy installed' },
    { value: settings.stat_experience || '10+', label: content['stats.experience_label'] || 'Years in the field' },
    { value: settings.stat_subsidy || '₹78,000', label: content['stats.subsidy_label'] || 'Subsidy support' },
  ];
  const activeBenefits = benefits.filter((benefit) => benefit.is_active);
  const activeServices = services.filter((service) => service.is_active);
  const popularPlans = plans.filter((plan) => plan.is_active).slice(0, 3);
  const activeTestimonials = testimonials.filter((testimonial) => testimonial.is_active).slice(0, 3);
  const editableSteps = STEPS.map((step, index) => ({
    title: content[`steps.step${index + 1}.title`] || step.title,
    desc: content[`steps.step${index + 1}.description`] || step.desc,
  }));
  const headingFont = 'Georgia, "Times New Roman", serif';

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          minHeight: { xs: 680, md: 600 },
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(90deg, rgba(13, 31, 26, .82) 0%, rgba(13, 31, 26, .58) 50%, rgba(13, 31, 26, .12) 100%), url("${content['hero.image'] || HERO_IMAGE}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 54%',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(0deg, rgba(12, 27, 22, .55), transparent 34%)',
            pointerEvents: 'none',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1, py: { xs: 10, md: 14 } }}>
          <Box
            component={motion.div}
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.7 }}
            sx={{ maxWidth: 760 }}
          >
            <Chip
              icon={<Bolt sx={{ color: 'inherit !important' }} />}
              label={content['hero.kicker'] || 'MADE FOR MAHARASHTRA'}
              sx={{
                mb: 3,
                px: 1,
                height: 36,
                color: '#F5C861',
                border: '1px solid rgba(245, 200, 97, .65)',
                bgcolor: 'rgba(20, 39, 31, .36)',
                borderRadius: '4px',
                fontSize: '0.73rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
              }}
            />
            <Typography
              component="h1"
              sx={{
                maxWidth: 750,
                mb: 2.5,
                fontFamily: headingFont,
                fontSize: { xs: '3rem', sm: '4.1rem', md: '5.15rem' },
                fontWeight: 500,
                lineHeight: { xs: 1.06, md: 1.02 },
              }}
            >
              {content['hero.title'] || 'Bring the power of the sun home.'}
            </Typography>
            <Typography sx={{ maxWidth: 580, mb: 4, color: 'rgba(255,255,255,.88)', fontSize: { xs: '1rem', md: '1.12rem' }, lineHeight: 1.8 }}>
              {content['hero.subtitle'] || 'Make your roof work harder. Arihant Electricals designs and installs solar systems that make everyday energy feel lighter.'}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={RouterLink}
                to="/contact"
                variant="contained"
                endIcon={<ArrowForward />}
                sx={{ px: 3.2, py: 1.5, color: '#1B2B21', bgcolor: '#F5C861', fontWeight: 800, borderRadius: '4px', '&:hover': { bgcolor: '#E9B846' } }}
              >
                {content['hero.cta'] || 'Get a free solar quote'}
              </Button>
              <Button
                href={`https://wa.me/${settings.whatsapp_1 || '917774855501'}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                sx={{ px: 3, py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,.7)', borderRadius: '4px', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,.1)' } }}
              >
                {content['hero.secondary_cta'] || 'Talk to our team'}
              </Button>
            </Stack>
          </Box>
          <Stack direction="row" spacing={1} sx={{ position: { md: 'absolute' }, right: { md: 24 }, bottom: { md: 48 }, mt: { xs: 8, md: 0 }, alignItems: 'center', color: 'rgba(255,255,255,.8)' }}>
            <SolarPower sx={{ color: '#F5C861' }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>{content['hero.caption'] || 'Thoughtful solar. Installed locally.'}</Typography>
          </Stack>
        </Container>
      </Box>

      <Box sx={{ bgcolor: '#F5C861' }}>
        <Container sx={{ py: { xs: 2.5, md: 3.2 } }}>
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {stats.map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Box sx={{ pl: { md: index ? 3 : 0 }, borderLeft: { md: index ? '1px solid rgba(30,42,35,.22)' : 'none' } }}>
                  <Typography sx={{ fontSize: { xs: '1.55rem', md: '2rem' }, fontWeight: 800, lineHeight: 1.1 }}>{stat.value}</Typography>
                  <Typography sx={{ mt: 0.45, fontSize: '0.82rem', fontWeight: 600, opacity: 0.78 }}>{stat.label}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Box sx={{ position: 'relative', minHeight: { xs: 300, md: 440 }, overflow: 'hidden', borderRadius: 3 }}>
                <Box component="img" src={content['intro.image'] || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1300&q=85'} alt="Solar panels converting sunlight into clean electricity" sx={{ width: '100%', height: { xs: 300, md: 440 }, objectFit: 'cover', display: 'block' }} />
                <Box sx={{ position: 'absolute', left: 16, bottom: 16, px: 2.5, py: 1.6, bgcolor: 'background.paper', color: 'text.primary', borderRadius: 2 }}>
                  <Typography sx={{ fontFamily: headingFont, fontSize: '1.5rem', lineHeight: 1 }}>{content['intro.image_caption_title'] || 'One sunny roof.'}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{content['intro.image_caption_subtitle'] || 'A brighter everyday.'}</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography sx={{ mb: 1.5, color: 'primary.main', fontSize: '0.76rem', fontWeight: 800, letterSpacing: '0.14em' }}>{content['intro.eyebrow'] || 'A SMARTER KIND OF ENERGY'}</Typography>
              <Typography component="h2" sx={{ maxWidth: 620, mb: 2, fontFamily: headingFont, fontSize: { xs: '2.4rem', md: '3.55rem' }, fontWeight: 500, lineHeight: 1.08 }}>
                {content['intro.title'] || 'More control over the energy you use.'}
              </Typography>
              <Typography sx={{ mb: 4, color: 'text.secondary', fontSize: '1rem', lineHeight: 1.8 }}>
                {content['intro.body'] || 'Good solar is more than panels on a roof. It is a system designed around your home, installed by people who know the work, and supported long after switch-on.'}
              </Typography>
              <Grid container spacing={2.5}>
                {activeBenefits.slice(0, 4).map((benefit) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={benefit.id}>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
                      <Box sx={{ flexShrink: 0, width: 42, height: 42, display: 'grid', placeItems: 'center', color: 'primary.main', bgcolor: 'action.hover', borderRadius: 2, '& svg': { fontSize: 23 } }}>
                        {getMappedIcon(benefit.icon ?? 'eco')}
                      </Box>
                      <Box>
                        <Typography sx={{ mb: 0.4, fontWeight: 800 }}>{benefit.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>{benefit.description}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'action.hover' }}>
        <Container>
          <SectionTitle eyebrow={content['services.eyebrow'] || 'What we do'} title={content['services.title'] || 'Everything you need to go solar.'} subtitle={content['services.subtitle'] || 'One local team for the details, the installation and the support that follows.'} />
          <Grid container spacing={2.5}>
            {activeServices.slice(0, 3).map((service, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={service.id}>
                <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.1 }} sx={{ height: '100%', overflow: 'hidden', borderRadius: 2, bgcolor: 'background.paper', boxShadow: 'none' }}>
                  <Box component="img" src={service.image_url || SERVICE_IMAGES[index % SERVICE_IMAGES.length]} alt={service.title} sx={{ display: 'block', width: '100%', height: 205, objectFit: 'cover' }} />
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center', mb: 1.2 }}>
                      <Box sx={{ color: 'primary.main', display: 'flex', '& svg': { fontSize: 25 } }}>{getMappedIcon(service.icon ?? 'solar_power')}</Box>
                      <Typography component="h3" sx={{ fontSize: '1.28rem', fontWeight: 800 }}>{service.title}</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ minHeight: 50, mb: 2, color: 'text.secondary', lineHeight: 1.7 }}>{service.short_description}</Typography>
                    {service.features?.slice(0, 3).map((feature) => (
                      <Stack key={feature} direction="row" spacing={1} sx={{ mb: 0.8, alignItems: 'center' }}>
                        <CheckCircle sx={{ fontSize: 17, color: 'primary.main' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>{feature}</Typography>
                      </Stack>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3.5, textAlign: 'center' }}>
            <Button component={RouterLink} to="/services" endIcon={<ArrowForward />} sx={{ color: 'primary.main', fontWeight: 800 }}>Explore all services</Button>
          </Box>
        </Container>
      </Box>

      <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: '#26382F', color: 'white' }}>
        <Container>
          <Box sx={{ maxWidth: 660, mx: 'auto', mb: { xs: 5, md: 7 }, textAlign: 'center' }}>
            <Typography sx={{ mb: 1, color: '#F5C861', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.15em' }}>{content['steps.eyebrow'] || 'FROM FIRST HELLO TO SWITCH-ON'}</Typography>
            <Typography component="h2" sx={{ mb: 1.5, fontFamily: headingFont, fontSize: { xs: '2.4rem', md: '3.35rem' }, fontWeight: 500, lineHeight: 1.1 }}>{content['steps.title'] || 'A clear path to solar.'}</Typography>
            <Typography sx={{ color: 'rgba(255,255,255,.7)', lineHeight: 1.75 }}>{content['steps.subtitle'] || 'No guesswork, no getting passed around. We keep your project moving at every step.'}</Typography>
          </Box>
          <Grid container spacing={{ xs: 3, md: 1 }}>
            {editableSteps.map((step, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
                <Box component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.45 }} sx={{ height: '100%', px: { md: 2.5 }, pt: 1.5, borderTop: '1px solid rgba(255,255,255,.28)' }}>
                  <Typography sx={{ mb: 2.4, color: '#F5C861', fontFamily: headingFont, fontSize: '2rem' }}>0{index + 1}</Typography>
                  <Typography component="h3" sx={{ mb: 1, fontWeight: 800, fontSize: '1.1rem' }}>{step.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,.68)', lineHeight: 1.75 }}>{step.desc}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {popularPlans.length > 0 && (
        <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
          <Container>
            <SectionTitle eyebrow={content['pricing.eyebrow'] || 'Simple, clear pricing'} title={content['pricing.title'] || 'Find the right size for your home.'} subtitle={content['pricing.subtitle'] || 'Explore popular system sizes. We will confirm the right fit and final quote after a site survey.'} />
            <Grid container spacing={2.5}>
              {popularPlans.map((plan, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                  <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.45 }} sx={{ position: 'relative', height: '100%', borderRadius: '4px', border: plan.is_popular ? '2px solid' : '1px solid', borderColor: plan.is_popular ? 'primary.main' : 'divider', boxShadow: 'none', bgcolor: 'background.paper' }}>
                    {plan.is_popular && <Chip label="MOST CHOSEN" size="small" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#E8EDDF', color: '#26382F', fontWeight: 800, borderRadius: '3px' }} />}
                    <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em' }}>{plan.system_type?.toUpperCase() || 'ON-GRID'}</Typography>
                      <Typography sx={{ mt: 1, fontFamily: headingFont, fontSize: '2.2rem' }}>{plan.kw} kW</Typography>
                      <Box sx={{ my: 2.4, pb: 2.4, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>₹{plan.total_cost.toLocaleString('en-IN')}</Typography>
                        <Typography sx={{ color: 'primary.dark', fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>₹{plan.final_cost.toLocaleString('en-IN')}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: 'primary.main', fontWeight: 700 }}>After ₹{plan.subsidy_amount.toLocaleString('en-IN')} subsidy</Typography>
                      </Box>
                      <Stack spacing={1.1} sx={{ mb: 3 }}>
                        {plan.monthly_savings && <PriceFeature>Save ₹{plan.monthly_savings.toLocaleString('en-IN')} / month</PriceFeature>}
                        {plan.panels_count && <PriceFeature>{plan.panels_count} solar panels</PriceFeature>}
                        {plan.area_required && <PriceFeature>Roof area: {plan.area_required}</PriceFeature>}
                      </Stack>
                      <Button component={RouterLink} to="/contact" fullWidth variant={plan.is_popular ? 'contained' : 'outlined'} sx={{ py: 1.2, borderRadius: '4px', fontWeight: 800, color: plan.is_popular ? 'white' : 'primary.main', borderColor: 'primary.main', bgcolor: plan.is_popular ? 'primary.dark' : 'transparent', '&:hover': { borderColor: 'primary.dark', bgcolor: plan.is_popular ? 'primary.dark' : 'action.hover' } }}>Get a tailored quote</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button component={RouterLink} to="/pricing" endIcon={<ArrowForward />} sx={{ color: 'primary.main', fontWeight: 800 }}>See all system options</Button>
            </Box>
          </Container>
        </Box>
      )}

      {activeTestimonials.length > 0 && (
        <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'action.hover' }}>
          <Container>
            <Grid container spacing={4} sx={{ alignItems: 'end', mb: 4 }}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography sx={{ mb: 1, color: 'primary.main', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em' }}>{content['testimonials.eyebrow'] || 'GOOD ENERGY, GOOD PEOPLE'}</Typography>
                <Typography component="h2" sx={{ fontFamily: headingFont, fontSize: { xs: '2.3rem', md: '3.1rem' }, lineHeight: 1.1 }}>{content['testimonials.title'] || 'A little sunshine goes a long way.'}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{content['testimonials.subtitle'] || 'Homeowners across Maharashtra are making the switch with a team they can reach, trust and recommend.'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2.5}>
              {activeTestimonials.map((testimonial, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
                  <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: index * 0.1, duration: 0.45 }} sx={{ height: '100%', borderRadius: '4px', bgcolor: 'background.paper', boxShadow: 'none' }}>
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Stack direction="row" spacing={0.3} sx={{ mb: 2 }}>
                        {Array.from({ length: testimonial.rating }).map((_, starIndex) => <Star key={starIndex} sx={{ color: '#D8A633', fontSize: 18 }} />)}
                      </Stack>
                      <Typography sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}>“{testimonial.message}”</Typography>
                      <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center' }}>
                        <Avatar src={testimonial.image_url || undefined} alt={testimonial.name} sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>{testimonial.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{testimonial.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{testimonial.location}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Box
        component="section"
        sx={{
          minHeight: { xs: 430, md: 480 },
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          color: 'white',
          backgroundImage: `linear-gradient(90deg, rgba(19, 37, 29, .9), rgba(19, 37, 29, .43)), url("${content['cta.image'] || 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2200&q=85'}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 48%',
        }}
      >
        <Container sx={{ py: 8 }}>
          <Box component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.55 }} sx={{ maxWidth: 690 }}>
            <Typography sx={{ mb: 1, color: '#F5C861', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.14em' }}>{content['cta.eyebrow'] || 'YOUR ROOF IS READY WHEN YOU ARE'}</Typography>
            <Typography component="h2" sx={{ mb: 2, fontFamily: headingFont, fontSize: { xs: '2.7rem', md: '4rem' }, lineHeight: 1.04 }}>{content['cta.title'] || "Let's make your next bill a little brighter."}</Typography>
            <Typography sx={{ mb: 3.5, maxWidth: 550, color: 'rgba(255,255,255,.82)', lineHeight: 1.75 }}>{content['cta.subtitle'] || 'Start with a free site survey. We will help you understand your options, savings and next steps.'}</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button component={RouterLink} to="/contact" variant="contained" endIcon={<ArrowForward />} sx={{ px: 3, py: 1.45, color: '#1E2A23', bgcolor: '#F5C861', fontWeight: 800, borderRadius: '4px', '&:hover': { bgcolor: '#E9B846' } }}>Book a free site survey</Button>
              <Button href={`tel:${settings.phone_1?.replace(/\s/g, '') || '+917774855501'}`} variant="outlined" sx={{ px: 3, py: 1.45, color: 'white', borderColor: 'rgba(255,255,255,.65)', borderRadius: '4px', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,.1)' } }}>Call {settings.phone_1 || '+91 77748 55501'}</Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

function PriceFeature({ children }: { children: React.ReactNode }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <CheckCircle sx={{ color: 'primary.main', fontSize: 18 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{children}</Typography>
    </Stack>
  );
}