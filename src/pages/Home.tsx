import { useMemo, useState, type ReactNode } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Grid,
  InputAdornment,
  MenuItem,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  Business,
  CheckCircle,
  ExpandMore,
  Home as HomeIcon,
  Apartment,
  Star,
  WhatsApp,
} from '@mui/icons-material';
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
import { supabase } from '../lib/supabase';
import { showSnackbar } from '@/components/ToastMessage';

const HERO_IMAGE =
  'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=2400';

const NAVY = '#0B2540';
const YELLOW = '#F4C65E';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const STEPS = [
  { title: 'Free home visit & rooftop survey', desc: 'Our team measures your roof and designs a system for maximum generation.' },
  { title: 'Clear design & quote', desc: 'You get a system size, price and savings estimate tailored to your bill.' },
  { title: 'Installation & subsidy support', desc: 'We install, connect and handle net-metering and PM Surya Ghar paperwork.' },
  { title: 'Solar on. You save.', desc: 'Your bill drops from day one, and we stay available for service and support.' },
];

const FAQS = [
  { q: 'How much can I save with rooftop solar?', a: 'Most homes see a large cut in their monthly bill from the first month. Use the calculator above for an estimate based on your own bill; we confirm exact numbers at the free site survey.' },
  { q: 'How big a system do I need?', a: 'It depends on your monthly consumption, shadow-free roof area and sunlight in your location. We size it after a free roof survey.' },
  { q: 'Do I need to pay everything upfront?', a: 'Not necessarily. Subsidy and bank finance options can reduce the upfront amount. Talk to our team for options that fit you.' },
  { q: 'Who handles the subsidy and net-metering paperwork?', a: 'We do. Our team manages the application and follow-ups so you do not have to chase offices.' },
  { q: 'How long does installation take?', a: 'Most home systems are installed within a few days once the design is approved, depending on roof, material availability and weather.' },
  { q: 'Will solar work during monsoon or a power cut?', a: 'Panels still generate in cloudy weather, at reduced output. A standard on-grid system shuts down during a grid outage for safety; a hybrid system with battery can keep key loads running.' },
  { q: 'How often should panels be cleaned?', a: 'Cleaning once or twice a month with water and a soft cloth keeps generation healthy. We can guide you on the best routine.' },
];

const BILL_RANGES = ['Less than ₹1,500', '₹1,500 – ₹2,500', '₹2,500 – ₹4,000', '₹4,000 – ₹8,000', 'More than ₹8,000'];

function num(value: string | undefined, fallback: number) {
  const n = parseFloat(value ?? '');
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function subsidyForKw(kw: number) {
  if (kw >= 3) return 78000;
  if (kw >= 2) return 60000;
  return 30000;
}

export default function Home() {
  const { content } = useContent('home');
  const { settings } = useSettings();
  const { benefits } = useBenefits();
  const { services } = useServices();
  const { plans } = usePricing();
  const { testimonials } = useTestimonials();

  const whatsapp = settings.whatsapp_1 || '917774855501';
  const phone = settings.phone_1 || '+91 77748 55501';

  const stats = [
    { value: settings.stat_installations || '500+', label: content['stats.installation_label'] || 'Homes powered' },
    { value: settings.stat_capacity || '2 MW+', label: content['stats.capacity_label'] || 'Solar installed' },
    { value: settings.stat_experience || '10+', label: content['stats.experience_label'] || 'Years of experience' },
    { value: settings.stat_subsidy || '₹78,000', label: content['stats.subsidy_label'] || 'Max subsidy support' },
  ];

  const activeBenefits = benefits.filter((b) => b.is_active).slice(0, 4);
  const activeServices = services.filter((s) => s.is_active).slice(0, 3);
  const activePlans = plans.filter((p) => p.is_active).slice(0, 3);
  const activeTestimonials = testimonials.filter((t) => t.is_active).slice(0, 3);

  const steps = STEPS.map((step, i) => ({
    title: content[`steps.step${i + 1}.title`] || step.title,
    desc: content[`steps.step${i + 1}.description`] || step.desc,
  }));

  /* ---------------- CALCULATOR (all rates editable from dashboard) ---------------- */
  const [bill, setBill] = useState(3000);
  const unitRate = num(settings.calc_unit_rate, 8); // ₹ per unit
  const unitsPerKwDay = num(settings.calc_units_per_kw_day, 4); // generation per kW per day
  const costPerKw = num(settings.calc_cost_per_kw, 60000); // fallback if no plan matches
  const billReduction = Math.min(num(settings.calc_bill_reduction_percent, 90), 100) / 100;

  const result = useMemo(() => {
    const monthlyUnits = bill / unitRate;
    const kw = Math.max(1, Math.ceil(monthlyUnits / 30 / unitsPerKwDay));
    const sorted = [...plans].filter((p) => p.is_active).sort((a, b) => a.kw - b.kw);
    const plan = sorted.find((p) => p.kw >= kw);
    const systemKw = plan ? plan.kw : kw;
    const subsidy = plan ? plan.subsidy_amount : subsidyForKw(kw);
    const total = plan ? plan.total_cost : kw * costPerKw;
    const finalCost = plan ? plan.final_cost : Math.max(total - subsidy, 0);
    const monthlySaving = plan?.monthly_savings ?? Math.round(bill * billReduction);
    const payback = monthlySaving > 0 ? (finalCost / (monthlySaving * 12)).toFixed(1) : '—';
    return { systemKw, subsidy, finalCost, monthlySaving, yearlySaving: monthlySaving * 12, payback };
  }, [bill, plans, unitRate, unitsPerKwDay, costPerKw, billReduction]);

  /* ---------------- LEAD FORM ---------------- */
  const [form, setForm] = useState({ name: '', phone: '', bill: '', pincode: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const setField = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return showSnackbar('error', 'Please enter your name.');
    if (!/^[6-9]\d{9}$/.test(form.phone)) return showSnackbar('error', 'Enter a valid 10-digit mobile number.');
    if (!form.bill) return showSnackbar('error', 'Please select your monthly bill range.');
    setSending(true);
    try {
      const { error } = await supabase.from('contacts').insert({
        name: form.name.trim(),
        email: '',
        phone: form.phone,
        message: `Quick enquiry from Home page. Monthly bill: ${form.bill}. PIN: ${form.pincode || 'n/a'}.`,
      });
      if (error) throw error;
      setSent(true);
      setForm({ name: '', phone: '', bill: '', pincode: '' });
    } catch (err) {
      showSnackbar('error', err instanceof Error ? err.message : 'Unable to submit. Please try WhatsApp.');
    } finally {
      setSending(false);
    }
  };

  const ctaBtn = {
    px: 3.5,
    py: 1.5,
    color: NAVY,
    bgcolor: YELLOW,
    fontWeight: 800,
    borderRadius: '10px',
    '&:hover': { bgcolor: '#E9B846' },
  } as const;

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: 'background.default', color: 'text.primary' }}>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          minHeight: { xs: 560, md: 640 },
          display: 'flex',
          alignItems: 'center',
          color: 'white',
          backgroundImage: `linear-gradient(90deg, rgba(11,37,64,.92) 0%, rgba(11,37,64,.7) 55%, rgba(11,37,64,.25) 100%), url("${content['hero.image'] || HERO_IMAGE}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container sx={{ py: { xs: 8, md: 12 } }}>
          <Box component={motion.div} initial="hidden" animate="visible" variants={reveal} transition={{ duration: 0.6 }} sx={{ maxWidth: 680 }}>
            <Chip
              icon={<Star sx={{ color: `${YELLOW} !important` }} />}
              label={content['hero.kicker'] || settings.rating_text || 'Trusted local rooftop solar team'}
              sx={{ mb: 3, color: 'white', bgcolor: 'rgba(255,255,255,.14)', fontWeight: 600 }}
            />
            <Typography component="h1" sx={{ mb: 2, fontSize: { xs: '2.3rem', md: '3.7rem' }, fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              {content['hero.title'] || 'Solar that delivers on its promise.'}
            </Typography>
            <Typography sx={{ mb: 4, fontSize: { xs: '1.02rem', md: '1.2rem' }, lineHeight: 1.7, color: 'rgba(255,255,255,.88)' }}>
              {content['hero.subtitle'] || 'Lower electricity bills. End-to-end care. Complete peace of mind.'}
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button href="#get-quote" variant="contained" endIcon={<ArrowForward />} sx={ctaBtn}>
                {content['hero.cta'] || 'Get a FREE consultation'}
              </Button>
              <Button
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                startIcon={<WhatsApp />}
                sx={{ px: 3, py: 1.5, color: 'white', borderColor: 'rgba(255,255,255,.7)', borderRadius: '10px', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,.1)' } }}
              >
                {content['hero.secondary_cta'] || 'Chat on WhatsApp'}
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* ================= SOLAR FOR ================= */}
      <Container sx={{ mt: { xs: -4, md: -6 }, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={2}>
          {[
            { icon: <HomeIcon />, title: 'Homes', text: content['for.homes'] || 'Cut your home electricity bill with rooftop solar.' },
            { icon: <Apartment />, title: 'Housing Societies', text: content['for.societies'] || 'Reduce common-area power costs.' },
            { icon: <Business />, title: 'Commercial', text: content['for.commercial'] || 'Power your shop, office or factory with solar.' },
          ].map((c) => (
            <Grid size={{ xs: 12, md: 4 }} key={c.title}>
              <Card component={RouterLink} to="/contact" sx={{ display: 'flex', gap: 2, p: 2.5, alignItems: 'center', textDecoration: 'none', color: 'inherit', height: '100%' }}>
                <Box sx={{ width: 52, height: 52, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 3, bgcolor: 'action.hover', color: 'primary.main' }}>{c.icon}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 800 }}>{c.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>{c.text}</Typography>
                </Box>
                <ArrowForward fontSize="small" sx={{ color: 'text.secondary' }} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ================= WHY TRUST ================= */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
        <Container>
          <SectionTitle
            eyebrow={content['intro.eyebrow'] || 'WHY FAMILIES TRUST US'}
            title={content['intro.title'] || 'Why families across Maharashtra trust Arihant Electricals'}
            subtitle={content['intro.body'] || 'Installation, subsidy paperwork and service handled by one local team.'}
          />
          <Grid container spacing={2.5}>
            {activeBenefits.map((b, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={b.id}>
                <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.45 }} sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                  <Box sx={{ mx: 'auto', mb: 2, width: 60, height: 60, display: 'grid', placeItems: 'center', borderRadius: '50%', bgcolor: 'action.hover', color: 'primary.main', '& svg': { fontSize: 30 } }}>
                    {getMappedIcon(b.icon ?? 'eco')}
                  </Box>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>{b.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{b.description}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= STATS ================= */}
      <Box sx={{ bgcolor: NAVY, color: 'white', py: { xs: 5, md: 7 } }}>
        <Container>
          <Typography component="h2" sx={{ textAlign: 'center', mb: 4, fontSize: { xs: '1.6rem', md: '2.2rem' }, fontWeight: 800 }}>
            {content['stats.title'] || 'Powering homes across Maharashtra'}
          </Typography>
          <Grid container spacing={3}>
            {stats.map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label} sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: { xs: '1.9rem', md: '2.6rem' }, fontWeight: 800, color: YELLOW, lineHeight: 1.1 }}>{s.value}</Typography>
                <Typography sx={{ mt: 0.5, fontSize: '0.9rem', opacity: 0.85 }}>{s.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= CALCULATOR ================= */}
      <Box component="section" id="calculator" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'action.hover' }}>
        <Container>
          <SectionTitle
            eyebrow={content['calculator.eyebrow'] || 'UNLOCK YOUR SOLAR SAVINGS'}
            title={content['calculator.title'] || 'Calculate your savings'}
            subtitle={content['calculator.subtitle'] || 'Slide to your average monthly electricity bill for an indicative system size and savings.'}
          />
          <Card sx={{ p: { xs: 3, md: 5 }, maxWidth: 980, mx: 'auto' }}>
            <Grid container spacing={{ xs: 3, md: 6 }} sx={{ alignItems: 'center' }}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>Monthly electricity bill</Typography>
                <Typography sx={{ fontSize: '2.6rem', fontWeight: 800, color: 'primary.main', mb: 1 }}>₹{bill.toLocaleString('en-IN')}</Typography>
                <Slider value={bill} min={1000} max={30000} step={500} onChange={(_, v) => setBill(v as number)} aria-label="Monthly electricity bill" />
                <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>₹1,000</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>₹30,000</Typography>
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                  Tip: use a 12-month average of your bills.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Grid container spacing={1.5}>
                  {[
                    { label: 'Recommended system', value: `${result.systemKw} kW` },
                    { label: 'Govt. subsidy', value: `₹${result.subsidy.toLocaleString('en-IN')}` },
                    { label: 'Monthly savings', value: `₹${result.monthlySaving.toLocaleString('en-IN')}` },
                    { label: 'Yearly savings', value: `₹${result.yearlySaving.toLocaleString('en-IN')}` },
                    { label: 'Cost after subsidy', value: `₹${result.finalCost.toLocaleString('en-IN')}` },
                    { label: 'Payback', value: result.payback === '—' ? '—' : `${result.payback} yrs` },
                  ].map((r) => (
                    <Grid size={{ xs: 6 }} key={r.label}>
                      <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'action.hover', textAlign: 'center' }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{r.label}</Typography>
                        <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', md: '1.35rem' } }}>{r.value}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
                <Button href="#get-quote" variant="contained" fullWidth endIcon={<ArrowForward />} sx={{ ...ctaBtn, mt: 2.5 }}>
                  Get my exact quote
                </Button>
                <Typography variant="caption" sx={{ display: 'block', mt: 1.5, color: 'text.secondary' }}>
                  Estimates are indicative; final figures are confirmed after a free site survey.
                </Typography>
              </Grid>
            </Grid>
          </Card>
        </Container>
      </Box>

      {/* ================= PROCESS ================= */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
        <Container>
          <SectionTitle
            eyebrow={content['steps.eyebrow'] || 'YOUR SOLAR JOURNEY'}
            title={content['steps.title'] || 'We handle everything. You just save.'}
            subtitle={content['steps.subtitle'] || ''}
          />
          <Grid container spacing={2.5}>
            {steps.map((step, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.title}>
                <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }} sx={{ height: '100%', p: 3 }}>
                  <Avatar sx={{ mb: 2, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 800 }}>{i + 1}</Avatar>
                  <Typography sx={{ fontWeight: 800, mb: 1 }}>{step.title}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>{step.desc}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ================= SERVICES ================= */}
      {activeServices.length > 0 && (
        <Box component="section" sx={{ py: { xs: 8, md: 11 }, bgcolor: 'action.hover' }}>
          <Container>
            <SectionTitle
              eyebrow={content['services.eyebrow'] || 'OUR SERVICES'}
              title={content['services.title'] || 'Everything you need to make the switch.'}
              subtitle={content['services.subtitle'] || ''}
            />
            <Grid container spacing={2.5}>
              {activeServices.map((s, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={s.id}>
                  <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }} sx={{ height: '100%', overflow: 'hidden' }}>
                    {s.image_url && <Box component="img" src={s.image_url} alt={s.title} loading="lazy" sx={{ display: 'block', width: '100%', height: 190, objectFit: 'cover' }} />}
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center', mb: 1 }}>
                        <Box sx={{ color: 'primary.main', display: 'flex' }}>{getMappedIcon(s.icon ?? 'solar_power')}</Box>
                        <Typography component="h3" sx={{ fontSize: '1.15rem', fontWeight: 800 }}>{s.title}</Typography>
                      </Stack>
                      <Typography variant="body2" sx={{ mb: 1.5, color: 'text.secondary', lineHeight: 1.7 }}>{s.short_description}</Typography>
                      {s.features?.slice(0, 3).map((f) => (
                        <FeatureLine key={f}>{f}</FeatureLine>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3.5, textAlign: 'center' }}>
              <Button component={RouterLink} to="/services" endIcon={<ArrowForward />} sx={{ fontWeight: 800 }}>Explore all services</Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* ================= PLANS ================= */}
      {activePlans.length > 0 && (
        <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
          <Container>
            <SectionTitle
              eyebrow={content['pricing.eyebrow'] || 'CLEAR PRICING'}
              title={content['pricing.title'] || 'See what going solar could look like.'}
              subtitle={content['pricing.subtitle'] || 'Popular system sizes with subsidy and savings.'}
            />
            <Grid container spacing={2.5}>
              {activePlans.map((p, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id}>
                  <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }} sx={{ position: 'relative', height: '100%', border: '2px solid', borderColor: p.is_popular ? 'primary.main' : 'divider' }}>
                    {p.is_popular && <Chip label="MOST CHOSEN" size="small" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: YELLOW, color: NAVY, fontWeight: 800 }} />}
                    <CardContent sx={{ p: { xs: 3, md: 3.5 } }}>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.74rem', fontWeight: 800, letterSpacing: '0.12em' }}>{p.system_type?.toUpperCase() || 'ON-GRID'}</Typography>
                      <Typography sx={{ mt: 0.5, fontSize: '2.1rem', fontWeight: 800 }}>{p.kw} kW</Typography>
                      <Box sx={{ my: 2, pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>₹{p.total_cost.toLocaleString('en-IN')}</Typography>
                        <Typography sx={{ color: 'primary.main', fontSize: '2rem', fontWeight: 800, lineHeight: 1.2 }}>₹{p.final_cost.toLocaleString('en-IN')}</Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700, color: 'success.main' }}>After ₹{p.subsidy_amount.toLocaleString('en-IN')} subsidy</Typography>
                      </Box>
                      <Stack spacing={1} sx={{ mb: 3 }}>
                        {p.monthly_savings && <FeatureLine>Save ₹{p.monthly_savings.toLocaleString('en-IN')} / month</FeatureLine>}
                        {p.panels_count && <FeatureLine>{p.panels_count} solar panels</FeatureLine>}
                        {p.area_required && <FeatureLine>Roof area: {p.area_required}</FeatureLine>}
                      </Stack>
                      <Button href="#get-quote" fullWidth variant={p.is_popular ? 'contained' : 'outlined'} sx={{ py: 1.2 }}>Get a tailored quote</Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button component={RouterLink} to="/pricing" endIcon={<ArrowForward />} sx={{ fontWeight: 800 }}>See all system options</Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* ================= TESTIMONIALS ================= */}
      {activeTestimonials.length > 0 && (
        <Box component="section" sx={{ py: { xs: 8, md: 10 }, bgcolor: 'action.hover' }}>
          <Container>
            <SectionTitle
              eyebrow={content['testimonials.eyebrow'] || 'FROM OUR CUSTOMERS'}
              title={content['testimonials.title'] || 'Our customers love their savings'}
              subtitle={content['testimonials.subtitle'] || ''}
            />
            <Grid container spacing={2.5}>
              {activeTestimonials.map((t, i) => (
                <Grid size={{ xs: 12, md: 4 }} key={t.id}>
                  <Card component={motion.div} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.45 }} sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={0.3} sx={{ mb: 2 }}>
                        {Array.from({ length: t.rating }).map((_, s) => <Star key={s} sx={{ color: '#D8A633', fontSize: 18 }} />)}
                      </Stack>
                      <Typography sx={{ mb: 3, color: 'text.secondary', lineHeight: 1.8 }}>“{t.message}”</Typography>
                      <Stack direction="row" spacing={1.3} sx={{ alignItems: 'center' }}>
                        <Avatar src={t.image_url || undefined} alt={t.name} sx={{ bgcolor: 'primary.main', width: 42, height: 42 }}>{t.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800 }}>{t.name}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>{t.location}</Typography>
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

      {/* ================= FAQ ================= */}
      <Box component="section" sx={{ py: { xs: 8, md: 11 } }}>
        <Container maxWidth="md">
          <SectionTitle eyebrow="FAQ" title={content['faq.title'] || 'All your questions, answered.'} subtitle="" />
          {FAQS.map((f, i) => (
            <Accordion key={f.q} disableGutters defaultExpanded={i === 0} sx={{ mb: 1.2, borderRadius: '14px !important', '&::before': { display: 'none' }, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <AccordionSummary expandIcon={<ExpandMore />} sx={{ px: 2.5 }}>
                <Typography sx={{ fontWeight: 700 }}>{content[`faq.${i + 1}.q`] || f.q}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>{content[`faq.${i + 1}.a`] || f.a}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ================= LEAD FORM ================= */}
      <Box id="get-quote" component="section" sx={{ py: { xs: 8, md: 10 }, background: `linear-gradient(135deg, ${NAVY} 0%, #14507F 100%)`, color: 'white', scrollMarginTop: 80 }}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography component="h2" sx={{ mb: 2, fontSize: { xs: '2rem', md: '2.8rem' }, fontWeight: 800, lineHeight: 1.15 }}>
                {content['cta.title'] || 'Talk to a solar expert'}
              </Typography>
              <Typography sx={{ mb: 3, color: 'rgba(255,255,255,.82)', lineHeight: 1.75 }}>
                {content['cta.subtitle'] || 'Cut your electricity bill by switching to solar. Share your details and our team will call you back.'}
              </Typography>
              <Button href={`tel:${phone.replace(/\s/g, '')}`} variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,.7)', borderRadius: '10px', py: 1.3, px: 3 }}>
                Call {phone}
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ p: { xs: 3, md: 4 }, color: 'text.primary' }}>
                {sent ? (
                  <Alert severity="success">Thank you! Our team will contact you shortly.</Alert>
                ) : (
                  <Box component="form" onSubmit={submitLead} noValidate>
                    <Stack spacing={2}>
                      <TextField label="Full name" value={form.name} onChange={setField('name')} required fullWidth />
                      <TextField
                        label="WhatsApp number"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                        required
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start">+91</InputAdornment> }, htmlInput: { inputMode: 'numeric' } }}
                      />
                      <TextField select label="Monthly electricity bill" value={form.bill} onChange={setField('bill')} required fullWidth>
                        {BILL_RANGES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                      </TextField>
                      <TextField
                        label="PIN code (optional)"
                        value={form.pincode}
                        onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) }))}
                        fullWidth
                        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
                      />
                      <Button type="submit" variant="contained" size="large" disabled={sending} startIcon={sending ? <CircularProgress size={18} color="inherit" /> : undefined} sx={ctaBtn}>
                        {sending ? 'Submitting…' : 'Submit details'}
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

function FeatureLine({ children }: { children: ReactNode }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <CheckCircle sx={{ color: 'success.main', fontSize: 18 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{children}</Typography>
    </Stack>
  );
}