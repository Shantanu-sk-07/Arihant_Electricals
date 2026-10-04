import {
  Box, Container, Grid, Typography, Card, CardContent, Stack,
  Button, Chip, CircularProgress, TextField, InputAdornment, Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';
import { CheckCircle, ArrowForward, Calculate, ElectricBolt } from '@mui/icons-material';
import { useState, useMemo } from 'react';
import { usePricing } from '@/hooks/usePricing';
import SectionTitle from '@/components/SectionTitle';
import { BRAND, SHADOW } from '@/constants/Brand';
import { useContent } from '@/hooks/useContent';

export default function Pricing() {
  const { plans, loading } = usePricing();
  const { content } = useContent('pricing');
  const [monthlyBill, setMonthlyBill] = useState<string>('3000');

  const billNum = parseFloat(monthlyBill) || 0;

  const recommendation = useMemo(() => {
    if (!plans.length || !billNum) return null;
    const unitRate = 8;
    const monthlyUnits = billNum / unitRate;
    const dailyUnits = monthlyUnits / 30;
    const requiredKW = Math.max(1, Math.ceil(dailyUnits / 4));

    const sorted = [...plans].filter((p) => p.is_active).sort((a, b) => a.kw - b.kw);
    const match = sorted.find((p) => p.kw >= requiredKW) || sorted[sorted.length - 1];

    return {
      requiredKW,
      plan: match,
      paybackYears:
        match.final_cost && match.monthly_savings
          ? (match.final_cost / (match.monthly_savings * 12)).toFixed(1)
          : null,
    };
  }, [plans, billNum]);

  const activePlans = plans.filter((p) => p.is_active);

  return (
    <Box>
      {/* HEADER */}
      <Box sx={{ background: `linear-gradient(135deg, rgba(32,49,40,.94), rgba(85,122,70,.8)), url("${content['hero.image'] || 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=2000&q=85'}") center/cover`, color: 'white', py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container>
          <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2, letterSpacing: '-0.02em' }}>
            {content['hero.title'] || 'Transparent Solar Pricing'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720, mx: 'auto' }}>
            {content['hero.subtitle'] || 'Get government subsidy up to ₹78,000 under PM Surya Ghar Yojana. Prices shown are final cost after subsidy.'}
          </Typography>
        </Container>
      </Box>

      {/* CALCULATOR */}
      <Container sx={{ mt: { xs: -5, md: -7 }, position: 'relative', zIndex: 2 }}>
        <Card sx={{ p: { xs: 3, md: 5 }, boxShadow: SHADOW.card, border: `1px solid ${BRAND.light}` }}>
          <Grid container spacing={4} sx={{ alignItems: 'center' }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={1.5} sx={{ mb: 2, alignItems: 'center' }}>
                <Calculate sx={{ color: BRAND.primary, fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {content['calculator.title'] || 'Savings Calculator'}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                {content['calculator.subtitle'] || 'Enter your monthly electricity bill and see the recommended system.'}
              </Typography>
              <TextField
                fullWidth
                label="Monthly Electricity Bill"
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: BRAND.primary } },
                  '& label.Mui-focused': { color: BRAND.primary },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 7 }}>
              {recommendation?.plan ? (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatBox label="Recommended" value={`${recommendation.plan.kw} KW`} color={BRAND.primary} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatBox label="Your Cost" value={`₹${(recommendation.plan.final_cost / 1000).toFixed(0)}K`} color="text.primary" />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatBox label="Monthly Saving" value={`₹${recommendation.plan.monthly_savings || 0}`} color={BRAND.success} />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <StatBox label="Payback" value={recommendation.paybackYears ? `${recommendation.paybackYears} yrs` : '—'} color={BRAND.accent} />
                  </Grid>
                </Grid>
              ) : (
                <Typography sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Enter a bill amount to see recommendation
                </Typography>
              )}
            </Grid>
          </Grid>
        </Card>
      </Container>

      {/* PRICING TABLE */}
      <Container sx={{ py: { xs: 8, md: 10 } }}>
        <SectionTitle
          eyebrow={content['plans.eyebrow'] || 'Pricing Plans'}
          title={content['plans.title'] || 'Choose Your Solar System'}
          subtitle={content['plans.subtitle'] || 'All prices include installation, GST, and 5-year workmanship warranty.'}
        />

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: BRAND.primary }} />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {activePlans.map((p, i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={p.id} sx={{ display: 'flex' }}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  sx={{
                    position: 'relative',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    border: p.is_popular
                      ? `2px solid ${BRAND.primary}`
                      : `1px solid ${BRAND.light}`,
                    transition: 'box-shadow 0.25s ease',
                    '&:hover': { boxShadow: SHADOW.cardHover },
                  }}
                >
                  {p.is_popular && (
                    <Chip
                      label="POPULAR"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: BRAND.accent,
                        color: BRAND.dark,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        zIndex: 2,
                      }}
                    />
                  )}
                  <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                      {p.kw} KW
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {p.system_type?.toUpperCase() || 'ON-GRID'}
                    </Typography>

                    <Box sx={{ my: 3 }}>
                      <Typography sx={{ fontWeight: 800, fontSize: '2.25rem', color: 'primary.main', lineHeight: 1 }}>
                        ₹{p.final_cost.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', textDecoration: 'line-through' }}>
                        ₹{p.total_cost.toLocaleString('en-IN')} total
                      </Typography>
                      <Chip
                        size="small"
                        label={`Save ₹${p.subsidy_amount.toLocaleString('en-IN')} subsidy`}
                        sx={{ mt: 1, bgcolor: `${BRAND.success}15`, color: BRAND.success, fontWeight: 700, fontSize: '0.7rem' }}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.25} sx={{ mb: 3, flex: 1 }}>
                      {p.monthly_savings && <FeatureRow text={`Save ₹${p.monthly_savings.toLocaleString('en-IN')}/month`} />}
                      {p.panels_count && <FeatureRow text={`${p.panels_count} Solar Panels`} />}
                      {p.area_required && <FeatureRow text={`Area Required: ${p.area_required}`} />}
                      <FeatureRow text="25-Year Panel Warranty" />
                      <FeatureRow text="Free Site Survey" />
                    </Stack>

                    <Button
                      component={RouterLink}
                      to="/contact"
                      fullWidth
                      variant={p.is_popular ? 'contained' : 'outlined'}
                      sx={{
                        bgcolor: p.is_popular ? 'primary.main' : 'transparent',
                        borderColor: BRAND.primary,
                        color: p.is_popular ? 'primary.contrastText' : 'primary.main',
                        py: 1.2,
                        '&:hover': { bgcolor: p.is_popular ? BRAND.primaryDark : `${BRAND.primary}10` },
                      }}
                    >
                      Get This System
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* SUBSIDY INFO */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'action.hover' }}>
        <Container>
          <SectionTitle eyebrow={content['subsidy.eyebrow'] || 'Government Subsidy'} title={content['subsidy.title'] || 'PM Surya Ghar: Muft Bijli Yojana'} subtitle={content['subsidy.subtitle'] || 'Central government subsidy for residential rooftop solar systems.'} />
          <Grid container spacing={3}>
            {[
              { label: '1 KW', subsidy: '₹18,000', note: 'Best for small homes' },
              { label: '2 KW', subsidy: '₹36,000', note: 'Ideal for 2–3 BHK' },
              { label: '3 KW & above', subsidy: '₹78,000', note: 'Maximum subsidy (capped)' },
            ].map((s, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={s.label}>
                <Card
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  sx={{ p: 3, textAlign: 'center', height: '100%', border: `1px solid ${BRAND.light}` }}
                >
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: `${BRAND.success}15`, color: BRAND.success, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                    <ElectricBolt />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>{s.label}</Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: '1.75rem', color: BRAND.success, mb: 0.5 }}>{s.subsidy}</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>{s.note}</Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container>
          <Card sx={{ p: { xs: 4, md: 6 }, textAlign: 'center', background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.primaryDark} 100%)`, color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>{content['cta.title'] || 'Get Your Personalised Quote'}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
              {content['cta.subtitle'] || 'Our team will visit your location for a free survey and design the perfect system for you.'}
            </Typography>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{ bgcolor: BRAND.accent, color: BRAND.dark, py: 1.5, px: 4, fontWeight: 700, '&:hover': { bgcolor: '#E5A200' } }}
            >
              {content['cta.button'] || 'Book Free Site Survey'}
            </Button>
          </Card>
        </Container>
      </Box>
    </Box>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <Box sx={{ textAlign: 'center', p: 1.5, borderRadius: 2, bgcolor: `${color}10` }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>{label}</Typography>
      <Typography sx={{ fontWeight: 800, color, fontSize: { xs: '1rem', md: '1.25rem' } }}>{value}</Typography>
    </Box>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <CheckCircle sx={{ fontSize: 18, color: BRAND.success }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>{text}</Typography>
    </Stack>
  );
}