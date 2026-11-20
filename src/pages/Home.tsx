import { useEffect, useRef, useState, type ReactElement } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Stack,
  Card,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Rating,
  Snackbar,
  MenuItem,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import VerifiedIcon from "@mui/icons-material/Verified";
import BoltIcon from "@mui/icons-material/Bolt";
import HandymanIcon from "@mui/icons-material/Handyman";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ShieldIcon from "@mui/icons-material/Shield";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HomeIcon from "@mui/icons-material/Home";
import ApartmentIcon from "@mui/icons-material/Apartment";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FactoryIcon from "@mui/icons-material/Factory";
import StarIcon from "@mui/icons-material/Star";
import { SITE_INFO } from "../config/SiteInfo";
import {
  fetchPublicContent,
  submitLead,
} from "../config/Services";
import type {
  FaqContent,
  HeroContent,
  LeadRequest,
  StatsContent,
  TestimonialsContent,
  WhyUsContent,
} from "../types";
import {
  BLUE,
  FONT,
  IMG,
  INK,
  LINE,
  MUTED,
  NAVY,
  NAVY_DEEP,
  SKY_DARK,
  SKY_LIGHT,
  SOFT,
  YELLOW,
  btn,
  navyOverlay,
  SectionHead,
} from "./SolarTheme";

/* ------------------------------------------------------------------ */
/* Segments ("Get Solar for")                                          */
/* ------------------------------------------------------------------ */

type Segment = "residential" | "society" | "commercial" | "industrial";

interface SegmentConfig {
  id: Segment;
  label: string;
  blurb: string;
  icon: ReactElement;
  headline: string;
  subheadline: string;
}

const SEGMENTS: SegmentConfig[] = [
  {
    id: "residential",
    label: "Homes",
    blurb: "Save up to 90% on your home electricity bills.",
    icon: <HomeIcon sx={{ fontSize: 34 }} />,
    headline: "Professional Solar RTS, installed right on your roof.",
    subheadline:
      "Site survey, 3D design, installation, subsidy and service — one trusted local team.",
  },
  {
    id: "society",
    label: "Housing Societies",
    blurb: "Cut common-area power bills and add long-term value.",
    icon: <ApartmentIcon sx={{ fontSize: 34 }} />,
    headline: "Turn your society's rooftop into a power plant.",
    subheadline:
      "Common-area savings. Group net-metering. Subsidy handled end-to-end.",
  },
  {
    id: "commercial",
    label: "Commercial",
    blurb: "Lower operating costs with a rooftop that earns.",
    icon: <StorefrontIcon sx={{ fontSize: 34 }} />,
    headline: "Rooftop solar that pays back in 2–4 years.",
    subheadline:
      "Commercial Solar RTS systems with engineered design and full O&M.",
  },
  {
    id: "industrial",
    label: "Industrial",
    blurb: "MW-scale rooftop plants with performance support.",
    icon: <FactoryIcon sx={{ fontSize: 34 }} />,
    headline: "Industrial-grade Solar RTS. Zero middlemen.",
    subheadline:
      "MW-scale rooftop solar with engineered generation and O&M support.",
  },
];

/* ------------------------------------------------------------------ */
/* Fallback content                                                    */
/* ------------------------------------------------------------------ */

const FALLBACK_HERO: HeroContent = {
  headline: "Professional Solar RTS, installed right on your roof.",
  subheadline:
    "Site survey, 3D design, installation, subsidy and service — one trusted local team.",
  ctaPrimary: "Book a Free Site Visit",
  ctaSecondary: "Calculate Savings",
  imageUrl: "",
};

const FALLBACK_STATS: StatsContent = {
  items: [
    { label: "Homes Solarized", value: 25000, suffix: "+" },
    { label: "MW Installed", value: 90, suffix: "+" },
    { label: "Subsidy Delivered", value: 120, suffix: " Cr" },
    { label: "On National Portal", value: 25000, suffix: "" },
  ],
};

const FALLBACK_WHYUS: WhyUsContent = {
  heading: "Why Families Across Maharashtra Trust Arihant Electricals",
  items: [
    {
      title: "Guaranteed Savings",
      description:
        "A Savings Guarantee with a money-back promise on every system we install.",
      icon: "verified",
    },
    {
      title: "Hassle-free Process",
      description:
        "Installation, subsidy and service — all handled directly by us. Zero middlemen.",
      icon: "bolt",
    },
    {
      title: "Storm-proof Structure",
      description:
        "WindPro Mount™ tested for 170 kmph storms — built for India's toughest weather.",
      icon: "handyman",
    },
    {
      title: "Reliable After-sales Service",
      description:
        "Regular proactive maintenance for steady, year-after-year performance.",
      icon: "support",
    },
  ],
};

const WHY_PHOTOS = [IMG.closeUp, IMG.installers, IMG.heroRooftop, IMG.society];

const TRUST_ITEMS: { icon: ReactElement; title: string }[] = [
  {
    icon: <ShieldIcon sx={{ fontSize: 34 }} />,
    title: "Generation guarantee or ₹8/unit Money Back",
  },
  {
    icon: <AutorenewIcon sx={{ fontSize: 34 }} />,
    title: "₹0 Repair and Replacement cost",
  },
  {
    icon: <HandymanIcon sx={{ fontSize: 34 }} />,
    title: "Proactive service visits",
  },
  {
    icon: <PhoneIphoneIcon sx={{ fontSize: 34 }} />,
    title: "App to track real-time power generation",
  },
];

const FALLBACK_TESTIMONIALS: TestimonialsContent = {
  heading: "90% of our customers recommend us",
  googleRating: 4.8,
  googleReviews: 15000,
  items: [
    {
      name: "Santosh Singh",
      location: "Pune",
      quote:
        "My solar journey with Arihant Electricals has been smooth and satisfying. Bills dropped from ₹18,000 to ₹0!",
      rating: 5,
      avatarUrl: "",
    },
    {
      name: "Dr. Sudhakar Shukla",
      location: "Nashik",
      quote:
        "From consultation to installation, everything was smooth! I've seen a 70% drop in electricity bills.",
      rating: 5,
      avatarUrl: "",
    },
    {
      name: "Samir Patil",
      location: "Mumbai",
      quote:
        "Arihant Electricals truly impressed me. The installation was clean and damage-free.",
      rating: 5,
      avatarUrl: "",
    },
  ],
};

const FALLBACK_FAQ: FaqContent = {
  heading: "All your questions, answered.",
  items: [
    {
      question: "What is a solar rooftop system?",
      answer:
        "A solar rooftop system converts sunlight into usable electricity using panels, an inverter, mounting structures, and cabling.",
    },
    {
      question: "How much can I save on my electricity bill?",
      answer:
        "Most homeowners cut their bills by 80–90% from Day 1, with savings growing as tariffs rise.",
    },
    {
      question: "Do solar panels work during cloudy weather?",
      answer:
        "Yes — with reduced efficiency. The drop is already factored into the generation estimates for every project.",
    },
    {
      question: "How long does installation take?",
      answer:
        "Once the 3D rooftop design is approved, installation is completed in 1 day, subject to weather.",
    },
    {
      question: "What subsidy is available?",
      answer:
        "Residential rooftop solar receives a government subsidy up to ₹78,000 for systems above 3 kW.",
    },
    {
      question: "Is there financing available?",
      answer:
        "Yes. We offer flexible EMI plans starting at ₹0 down payment with collateral-free loans from partner banks.",
    },
    {
      question: "How long does a solar system last?",
      answer:
        "A high-quality system lasts 25+ years. Panels carry a 25-year performance warranty; inverters carry 5–10 years.",
    },
    {
      question: "What maintenance is required?",
      answer:
        "Quarterly cleaning and occasional inspections. We include 5 years of free annual maintenance with every install.",
    },
  ],
};

const STAT_ICONS: Record<string, ReactElement> = {
  verified: <VerifiedIcon sx={{ fontSize: 30 }} />,
  bolt: <BoltIcon sx={{ fontSize: 30 }} />,
  handyman: <HandymanIcon sx={{ fontSize: 30 }} />,
  support: <SupportAgentIcon sx={{ fontSize: 30 }} />,
};

const HANDLE_STEPS = [
  {
    title: "Free Home Visit & Rooftop Survey",
    desc: "Our team measures your rooftop to design a solar system for maximum generation.",
  },
  {
    title: "Free 3D Solar Design",
    desc: "We share a personalised 3D rooftop design so you can see exactly how it will look on your home.",
  },
  {
    title: "Hassle-Free Installation & Subsidy Support",
    desc: "Our experts install your system and handle all the paperwork, including the subsidy.",
  },
  {
    title: "Solar On. You Save. We Maintain.",
    desc: "Your system starts saving from day one while we handle maintenance year after year.",
  },
];

const BILL_RANGES = [
  "Less than ₹1500",
  "₹1500 - ₹2500",
  "₹2500 - ₹4000",
  "₹4000 - ₹8000",
  "More than ₹8000",
];

/* ------------------------------------------------------------------ */
/* Recommendation calculator                                           */
/* ------------------------------------------------------------------ */

const TARIFF_PER_UNIT = 8;
const UNITS_PER_KW_PER_MONTH = 120;

interface Recommendation {
  kw: number;
  isRecommended: boolean;
  systemCost: number;
  subsidy: number;
  netCost: number;
  monthlySavings: number;
  paybackYears: number;
}

function buildRecommendations(monthlyBill: number): Recommendation[] {
  const recommendedKw = Math.max(
    1,
    Math.round((monthlyBill / (TARIFF_PER_UNIT * UNITS_PER_KW_PER_MONTH)) * 10) /
      10
  );
  const recommendedSize = Math.max(1, Math.round(recommendedKw));
  const options = Array.from(
    new Set([
      Math.max(1, Math.ceil(recommendedKw - 1)),
      Math.max(1, Math.round(recommendedKw)),
      Math.max(2, Math.ceil(recommendedKw + 1)),
    ])
  ).slice(0, 3);
  return options.map((kw) => {
    const systemCost = kw * 55000;
    const subsidy = kw <= 1 ? 30000 : kw === 2 ? 60000 : kw >= 3 ? 78000 : 0;
    const netCost = Math.max(0, systemCost - subsidy);
    const monthlySavings = Math.min(
      monthlyBill,
      kw * UNITS_PER_KW_PER_MONTH * TARIFF_PER_UNIT
    );
    const paybackYears =
      monthlySavings > 0
        ? Math.round((netCost / (monthlySavings * 12)) * 10) / 10
        : 0;
    return {
      kw,
      isRecommended: kw === recommendedSize,
      systemCost,
      subsidy,
      netCost,
      monthlySavings,
      paybackYears,
    };
  });
}

/* ------------------------------------------------------------------ */
/* Count-up                                                            */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, duration = 1600) {
  const [value, setValue] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number): void => {
              const progress = Math.min((now - start) / duration, 1);
              setValue(Math.floor(progress * target));
              if (progress < 1) requestAnimationFrame(tick);
              else setValue(target);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function StatBlock({
  label,
  value,
  suffix,
}: {
  label: string;
  value: number;
  suffix: string;
}) {
  const { value: count, ref } = useCountUp(value);
  return (
    <Box ref={ref} sx={{ textAlign: "center" }}>
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: { xs: "2rem", md: "3rem" },
          color: YELLOW,
          lineHeight: 1.1,
        }}
      >
        {count.toLocaleString("en-IN")}
        {suffix}
      </Typography>
      <Typography sx={{ color: "rgba(255,255,255,0.85)", fontWeight: 500 }}>
        {label}
      </Typography>
    </Box>
  );
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    "& fieldset": { borderColor: LINE },
    "&:hover fieldset": { borderColor: BLUE },
    "&.Mui-focused fieldset": { borderColor: NAVY },
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [hero, setHero] = useState<HeroContent>(FALLBACK_HERO);
  const [stats, setStats] = useState<StatsContent>(FALLBACK_STATS);
  const [whyUs, setWhyUs] = useState<WhyUsContent>(FALLBACK_WHYUS);
  const [testimonials, setTestimonials] =
    useState<TestimonialsContent>(FALLBACK_TESTIMONIALS);
  const [faq, setFaq] = useState<FaqContent>(FALLBACK_FAQ);

  const [segment, setSegment] = useState<Segment>("residential");
  const segmentConfig = SEGMENTS.find((s) => s.id === segment) ?? SEGMENTS[0];

  const [photoOffset] = useState<number>(() => Math.floor(Math.random() * WHY_PHOTOS.length));
  const [heroPhoto] = useState<string>(() => WHY_PHOTOS[photoOffset]);
  const [featuredInstallPhoto] = useState<string>(() => WHY_PHOTOS[(photoOffset + 1) % WHY_PHOTOS.length]);
  const [billInput, setBillInput] = useState<string>("");
  const [calcError, setCalcError] = useState<string>("");
  const [showRecommendations, setShowRecommendations] = useState<boolean>(false);

  const [leadName, setLeadName] = useState<string>("");
  const [leadPhone, setLeadPhone] = useState<string>("");
  const [leadBillRange, setLeadBillRange] = useState<string>("");
  const [leadBill, setLeadBill] = useState<string>("");
  const [leadMessage] = useState<string>("");
  const [leadLoading, setLeadLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    let active = true;
    const load = async (): Promise<void> => {
      try {
        const [h, s, w, t, f] = await Promise.all([
          fetchPublicContent<HeroContent>("hero"),
          fetchPublicContent<StatsContent>("stats"),
          fetchPublicContent<WhyUsContent>("whyus"),
          fetchPublicContent<TestimonialsContent>("testimonials"),
          fetchPublicContent<FaqContent>("faq"),
        ]);
        if (!active) return;
        setHero(h);
        setStats(s);
        setWhyUs(w);
        setTestimonials(t);
        setFaq(f);
      } catch {
        /* fallbacks already rendered */
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const billNum = Number(billInput);
  const recommendations =
    showRecommendations && !Number.isNaN(billNum) && billNum > 0
      ? buildRecommendations(billNum)
      : [];

  const handleCalculate = (): void => {
    setCalcError("");
    setShowRecommendations(false);
    if (!billInput || Number.isNaN(billNum) || billNum <= 0) {
      setCalcError("Enter a valid monthly bill amount");
      return;
    }
    setShowRecommendations(true);
  };

  const scrollTo = (id: string): void => {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const billFromRange = (range: string): number => {
    const map: Record<string, number> = {
      "Less than ₹1500": 1000,
      "₹1500 - ₹2500": 2000,
      "₹2500 - ₹4000": 3250,
      "₹4000 - ₹8000": 6000,
      "More than ₹8000": 10000,
    };
    return map[range] ?? 0;
  };

  const handleLeadSubmit = async (): Promise<void> => {
    if (!leadName.trim() || !/^\d{10}$/.test(leadPhone.replace(/\D/g, ""))) {
      setToastSeverity("error");
      setToast("Enter a valid name and 10-digit phone");
      return;
    }
    const exactBill = Number(leadBill) > 0 ? Number(leadBill) : 0;
    const payload: LeadRequest = {
      name: leadName.trim(),
      phone: leadPhone.replace(/\D/g, ""),
      pincode: "000000",
      monthlyBill: exactBill || billFromRange(leadBillRange),
      message: `${leadMessage.trim()}${
        leadBillRange ? ` Bill range: ${leadBillRange}` : ""
      }`.trim(),
    };
    setLeadLoading(true);
    try {
      await submitLead(payload);
      setToastSeverity("success");
      setToast("Enquiry submitted. Our team will contact you shortly.");
      setLeadName("");
      setLeadPhone("");
      setLeadBill("");
      setLeadBillRange("");
    } catch (err) {
      setToastSeverity("error");
      setToast(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setLeadLoading(false);
    }
  };

  return (
    <Box sx={{ fontFamily: FONT, backgroundColor: "#FFFFFF", color: INK }}>
      {/* ============ HERO ============ */}
      <Box
        sx={{
          color: "#FFFFFF",
          pt: { xs: 8, md: 12 },
          pb: { xs: 14, md: 20 },
          px: 2,
          backgroundImage: navyOverlay(heroPhoto, 0.78),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Chip
                icon={<StarIcon sx={{ color: `${YELLOW} !important` }} />}
                label="Solar RTS Specialists · Local Service Team"
                sx={{
                  bgcolor: "rgba(255,255,255,0.14)",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  backdropFilter: "blur(6px)",
                  mb: 3,
                }}
              />
              <Typography
                component="h1"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.1,
                  fontSize: { xs: "2.2rem", md: "3.4rem" },
                }}
              >
                {segmentConfig.headline}
              </Typography>
              <Typography
                sx={{
                  mt: 2.5,
                  opacity: 0.95,
                  fontSize: { xs: "1.05rem", md: "1.25rem" },
                  maxWidth: 580,
                }}
              >
                {segmentConfig.subheadline}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                sx={{ mt: 4 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => scrollTo("lead-form")}
                  sx={btn("yellow")}
                >
                  {hero.ctaPrimary}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => scrollTo("calculator")}
                  sx={btn("ghost")}
                >
                  {hero.ctaSecondary}
                </Button>
              </Stack>
              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 4, flexWrap: "wrap", rowGap: 1 }}
              >
                {SITE_INFO.certifications.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255,255,255,0.16)",
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </Grid>

            {/* Quick savings card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Card
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: "20px",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.35)",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{ color: BLUE, fontWeight: 800, letterSpacing: "0.16em" }}
                >
                  30-SECOND ESTIMATE
                </Typography>
                <Typography
                  sx={{ fontWeight: 800, color: NAVY, fontSize: "1.6rem", mb: 0.5 }}
                >
                  What could solar save you?
                </Typography>
                <Typography variant="body2" sx={{ color: MUTED, mb: 2.5 }}>
                  Enter your average monthly bill and see a suggested rooftop
                  system.
                </Typography>
                <TextField
                  fullWidth
                  value={billInput}
                  onChange={(e) => {
                    setBillInput(e.target.value.replace(/[^\d]/g, ""));
                    setShowRecommendations(false);
                  }}
                  placeholder="Monthly bill, e.g. 3000"
                  slotProps={{
                    htmlInput: { inputMode: "numeric" },
                    input: {
                      startAdornment: (
                        <Typography sx={{ mr: 1, fontWeight: 700, color: NAVY }}>
                          ₹
                        </Typography>
                      ),
                    },
                  }}
                  sx={{ ...fieldSx, mb: 2 }}
                />
                <Button
                  fullWidth
                  size="large"
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => scrollTo("calculator")}
                  sx={{ ...btn("navy"), py: 1.5 }}
                >
                  See my system size
                </Button>
                <Stack spacing={1} sx={{ mt: 2.5 }}>
                  {[
                    "Free rooftop survey & 3D design",
                    "Subsidy paperwork handled by us",
                  ].map((l) => (
                    <Box key={l} sx={{ display: "flex", gap: 1 }}>
                      <CheckCircleIcon sx={{ fontSize: 18, color: BLUE }} />
                      <Typography variant="body2" sx={{ color: MUTED }}>
                        {l}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ GET SOLAR FOR (overlaps hero) ============ */}
      <Container maxWidth="lg" sx={{ mt: { xs: -9, md: -12 }, position: "relative" }}>
        <Card
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: "20px",
            boxShadow: "0 24px 60px rgba(7,26,64,0.18)",
          }}
        >
          <Typography
            sx={{ fontWeight: 800, color: NAVY, fontSize: "1.5rem", mb: 2.5 }}
          >
            Solar RTS for every rooftop
          </Typography>
          <Grid container spacing={2}>
            {SEGMENTS.map((s) => {
              const active = s.id === segment;
              return (
                <Grid key={s.id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Box
                    onClick={() => setSegment(s.id)}
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      p: 2.5,
                      borderRadius: "14px",
                      border: `2px solid ${active ? NAVY : LINE}`,
                      backgroundColor: active ? NAVY : "#FFFFFF",
                      color: active ? "#FFFFFF" : INK,
                      transition: "all .2s",
                      "&:hover": {
                        borderColor: NAVY,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Box sx={{ color: active ? YELLOW : BLUE, mb: 1 }}>
                      {s.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: "1.1rem" }}>
                      {s.label}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mt: 0.5, color: active ? "rgba(255,255,255,0.8)" : MUTED }}
                    >
                      {s.blurb}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Card>
      </Container>

      {/* ============ WHY TRUST ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <SectionHead title={whyUs.heading} />
          <Grid container spacing={3}>
            {whyUs.items.map((item, i) => (
              <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: `1px solid ${LINE}`,
                    transition: "all .25s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 18px 40px rgba(11,37,89,0.14)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 170,
                      backgroundImage: `url('${WHY_PHOTOS[(i + photoOffset) % WHY_PHOTOS.length]}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <Box sx={{ p: 3 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: SOFT,
                        color: BLUE,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                        mt: -5.5,
                        position: "relative",
                        border: "3px solid #fff",
                      }}
                    >
                      {STAT_ICONS[item.icon] ?? <VerifiedIcon />}
                    </Box>
                    <Typography
                      sx={{ fontWeight: 800, fontSize: "1.15rem", mb: 1, color: NAVY }}
                    >
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: MUTED }}>
                      {item.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============ ARIHANT PROMISE ============ */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          px: 2,
          color: "#FFFFFF",
          backgroundImage: navyOverlay(IMG.panelsSky, 0.9),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="overline"
                sx={{ color: YELLOW, fontWeight: 800, letterSpacing: "0.2em" }}
              >
                Introducing
              </Typography>
              <Typography
                sx={{ fontWeight: 800, fontSize: { xs: "2.2rem", md: "3.2rem" }, lineHeight: 1.1 }}
              >
                The Arihant Promise
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "1.2rem", opacity: 0.9 }}>
                A guaranteed solar savings plan, backed in writing.
              </Typography>
              <Button
                component={RouterLink}
                to="/services"
                endIcon={<ArrowForwardIcon />}
                sx={{ ...btn("yellow"), mt: 3 }}
              >
                Know More
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={2}>
                {TRUST_ITEMS.map((item) => (
                  <Grid key={item.title} size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2.5,
                        height: "100%",
                        borderRadius: "14px",
                        bgcolor: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Box sx={{ color: YELLOW, mb: 1 }}>{item.icon}</Box>
                      <Typography sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ STATS ============ */}
      <Box sx={{ py: { xs: 7, md: 9 }, px: 2, backgroundColor: NAVY_DEEP }}>
        <Container maxWidth="lg">
          <Typography
            sx={{
              fontWeight: 800,
              textAlign: "center",
              color: "#FFFFFF",
              mb: 5,
              fontSize: { xs: "1.6rem", md: "2.2rem" },
            }}
          >
            Rooftop Solar for Homes & Businesses
          </Typography>
          <Grid container spacing={3}>
            {stats.items.map((item, idx) => (
              <Grid key={`${item.label}-${idx}`} size={{ xs: 6, md: 3 }}>
                <StatBlock label={item.label} value={item.value} suffix={item.suffix} />
              </Grid>
            ))}
          </Grid>
          <Typography sx={{ textAlign: "center", mt: 5, color: "rgba(255,255,255,0.8)" }}>
            Mainly serving {SITE_INFO.serviceAreas.join(", ")} with rooftop
            solar, subsidy assistance and ongoing service.
          </Typography>
        </Container>
      </Box>

      {/* ============ CALCULATOR ============ */}
      <Box
        id="calculator"
        sx={{ py: { xs: 8, md: 12 }, px: 2, backgroundColor: SOFT }}
      >
        <Container maxWidth="lg">
          <SectionHead
            eyebrow="UNLOCK YOUR SOLAR SAVINGS"
            title="Calculate your savings"
            sub="Use the monthly amount on your electricity bill to see suitable Solar RTS system options for your home."
          />
          <Card
            elevation={0}
            sx={{
              maxWidth: 760,
              mx: "auto",
              p: { xs: 3, md: 5 },
              borderRadius: "20px",
              boxShadow: "0 18px 50px rgba(11,37,89,0.12)",
            }}
          >
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: NAVY }}>
                  Average monthly electricity bill
                </Typography>
                <TextField
                  fullWidth
                  value={billInput}
                  onChange={(e) => {
                    setBillInput(e.target.value.replace(/[^\d]/g, ""));
                    setShowRecommendations(false);
                    setCalcError("");
                  }}
                  placeholder="Enter the amount shown on your bill"
                  slotProps={{
                    htmlInput: { inputMode: "numeric", "aria-label": "Monthly electricity bill in rupees" },
                    input: {
                      startAdornment: (
                        <Typography sx={{ mr: 1, fontWeight: 700, color: NAVY }}>
                          ₹
                        </Typography>
                      ),
                    },
                  }}
                  sx={fieldSx}
                />
                <Typography variant="caption" sx={{ display: "block", mt: 1, color: MUTED }}>
                  No PIN code needed. Your estimate is based on your electricity bill.
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2.5 }}>
              {[1500, 3000, 5000, 10000, 25000].map((preset) => {
                const on = billInput === String(preset);
                return (
                  <Chip
                    key={preset}
                    label={`₹${preset.toLocaleString("en-IN")}`}
                    onClick={() => setBillInput(String(preset))}
                    sx={{
                      bgcolor: on ? NAVY : "#FFFFFF",
                      color: on ? "#FFFFFF" : NAVY,
                      border: `1px solid ${on ? NAVY : LINE}`,
                      fontWeight: 700,
                      "&:hover": { bgcolor: on ? NAVY_DEEP : SOFT },
                    }}
                  />
                );
              })}
            </Box>
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={handleCalculate}
              endIcon={<ArrowForwardIcon />}
              sx={{ ...btn("yellow"), py: 1.7 }}
            >
              Show my solar recommendations
            </Button>
            {calcError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {calcError}
              </Alert>
            )}
          </Card>

          {recommendations.length > 0 && (
            <Box sx={{ mt: 7 }}>
              <Box
                sx={{
                  maxWidth: 760,
                  mx: "auto",
                  mb: 4,
                  p: { xs: 2.5, md: 3.5 },
                  borderRadius: "20px 20px 20px 6px",
                  color: "#FFFFFF",
                  background: `linear-gradient(125deg, ${NAVY} 0%, ${SKY_DARK} 100%)`,
                  boxShadow: "0 18px 42px rgba(7,26,46,0.18)",
                }}
              >
                <Typography variant="overline" sx={{ color: "#BAE6FD", fontWeight: 800, letterSpacing: ".12em" }}>
                  YOUR PERSONAL SOLAR ESTIMATE
                </Typography>
                <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.3rem", md: "1.65rem" }, lineHeight: 1.25 }}>
                  Options for your ₹{billNum.toLocaleString("en-IN")} monthly bill
                </Typography>
                <Typography sx={{ mt: 1, color: "rgba(255,255,255,.82)", lineHeight: 1.65 }}>
                  Compare system sizes, estimated monthly savings, subsidy and indicative payback. Our team can confirm the final design after a rooftop assessment.
                </Typography>
              </Box>
              <Grid container spacing={3} sx={{ justifyContent: "center" }}>
                {recommendations.map((r) => {
                  const highlight = r.isRecommended;
                  return (
                    <Grid key={r.kw} size={{ xs: 12, sm: 6, md: 4 }}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: highlight ? "24px 24px 24px 8px" : "18px",
                          position: "relative",
                          overflow: "hidden",
                          border: `1px solid ${highlight ? SKY_DARK : LINE}`,
                          boxShadow: highlight ? "0 18px 44px rgba(3,105,161,0.18)" : "0 8px 24px rgba(11,37,64,0.06)",
                          background: highlight ? "linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 42%)" : "#FFFFFF",
                        }}
                      >
                        {highlight && (
                          <Box
                            sx={{
                              mx: -3,
                              mt: -3,
                              mb: 2,
                              px: 3,
                              py: 1,
                              color: NAVY,
                              background: "linear-gradient(90deg, #BAE6FD, #E0F2FE)",
                              fontSize: ".77rem",
                              fontWeight: 800,
                              letterSpacing: ".08em",
                              textTransform: "uppercase",
                            }}
                          >
                            Best fit for your bill
                          </Box>
                        )}
                        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
                          <Box sx={{ display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: "15px 15px 15px 5px", bgcolor: SKY_LIGHT, color: SKY_DARK }}>
                            <SolarPowerIcon />
                          </Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: NAVY }}>
                          {r.kw} kW System
                          </Typography>
                        </Stack>
                        <Typography variant="body2" sx={{ color: MUTED, mb: 2 }}>
                          Estimated fit for your household usage
                        </Typography>
                        <Stack spacing={1.2} sx={{ mb: 3, flexGrow: 1 }}>
                          {[
                            ["Monthly Savings", `₹${r.monthlySavings.toLocaleString("en-IN")}`],
                            ["Estimated system cost", `₹${r.systemCost.toLocaleString("en-IN")}`],
                            ["Indicative subsidy", `₹${r.subsidy.toLocaleString("en-IN")}`],
                            ["Estimated net cost", `₹${r.netCost.toLocaleString("en-IN")}`],
                            ["Indicative payback", `${r.paybackYears} years`],
                          ].map(([k, v]) => (
                            <Box key={k} sx={{ display: "flex", justifyContent: "space-between", gap: 1, borderBottom: `1px solid ${LINE}`, pb: 1 }}>
                              <Typography variant="body2" sx={{ color: MUTED }}>
                                {k}
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: NAVY }}>
                                {v}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => {
                            setLeadBill(String(billNum));
                            scrollTo("lead-form");
                          }}
                          sx={btn(highlight ? "sky" : "navy")}
                        >
                          Request a site assessment
                        </Button>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
              <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 2.5, color: MUTED, lineHeight: 1.6 }}>
                Estimates are indicative and depend on your rooftop, usage, tariff and current subsidy eligibility. Arihant Electricals will confirm the system and pricing after a free site assessment.
              </Typography>
            </Box>
          )}
        </Container>
      </Box>

      {/* ============ SEE SOLAR BEFORE YOU BUY ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: BLUE, fontWeight: 800, letterSpacing: "0.18em" }}>
                EXPERIENCE IT LIVE
              </Typography>
              <Typography
                sx={{ fontWeight: 800, color: NAVY, fontSize: { xs: "1.9rem", md: "2.8rem" }, lineHeight: 1.1, mb: 2 }}
              >
                See Solar Before You Buy.
              </Typography>
              <Typography sx={{ color: MUTED, mb: 3, fontSize: "1.05rem" }}>
                See our WindPro Mount™ setup, understand savings, and clear
                every doubt — in one visit.
              </Typography>
              <Stack spacing={1.5} sx={{ mb: 4 }}>
                {[
                  "See our live solar setup in action",
                  "Get a Free 3D Design for Your Home",
                  "See how maintenance impacts performance",
                  "Understand your savings, financing options and payback",
                ].map((line) => (
                  <Box key={line} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <CheckCircleIcon sx={{ color: BLUE, fontSize: 22 }} />
                    <Typography>{line}</Typography>
                  </Box>
                ))}
              </Stack>
              <Button
                component={RouterLink}
                to="/contact"
                endIcon={<ArrowForwardIcon />}
                sx={btn("navy")}
              >
                Book My Visit
              </Button>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: "24px",
                  minHeight: { xs: 300, md: 440 },
                  backgroundImage: `linear-gradient(180deg, rgba(7,26,64,0.02) 25%, rgba(7,26,64,0.72) 100%), url('${featuredInstallPhoto}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "flex-end",
                  p: 3.5,
                  color: "#FFFFFF",
                  boxShadow: "0 24px 60px rgba(11,37,89,0.25)",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.4rem" }}>
                    Professional rooftop installation
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.92 }}>
                    Carefully planned Solar RTS installation with secure rooftop mounting.
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ WE HANDLE EVERYTHING ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, backgroundColor: SOFT }}>
        <Container maxWidth="lg">
          <SectionHead title="We Handle Everything. You Just Save." />
          <Grid container spacing={3}>
            {HANDLE_STEPS.map((s, i) => (
              <Grid key={s.title} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ p: 3.5, height: "100%", borderRadius: "18px", border: `1px solid ${LINE}` }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      bgcolor: YELLOW,
                      color: INK,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: NAVY, mb: 1 }}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: MUTED }}>
                    {s.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============ MONITORING APP ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, backgroundColor: NAVY, color: "#FFFFFF" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  width: 220,
                  height: 420,
                  borderRadius: "36px",
                  bgcolor: NAVY_DEEP,
                  border: "8px solid #0A0F1F",
                  p: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 30px 70px rgba(0,0,0,0.45)",
                }}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.7, fontWeight: 600 }}>
                    Arihant Solar
                  </Typography>
                  <Typography sx={{ color: YELLOW, fontWeight: 800, fontSize: "2.2rem" }}>
                    24.6 kW
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Today's generation
                  </Typography>
                </Box>
                <Box>
                  <Box
                    sx={{
                      height: 90,
                      borderRadius: 2,
                      mb: 1.5,
                      background: `linear-gradient(180deg, ${YELLOW}99, ${YELLOW}0D)`,
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    Savings this month
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.4rem" }}>₹6,240</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="overline" sx={{ color: YELLOW, fontWeight: 800, letterSpacing: "0.18em" }}>
                REAL-TIME MONITORING APP
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.8rem", md: "2.6rem" }, lineHeight: 1.12, mb: 1 }}>
                Track the performance of your solar system — anywhere, anytime.
              </Typography>
              <Stack spacing={2.5} sx={{ mt: 4 }}>
                {[
                  { icon: <BoltIcon />, title: "Track your power generation" },
                  { icon: <VerifiedIcon />, title: "Get 100% visibility on your savings" },
                  { icon: <PhoneIphoneIcon />, title: "Track your referrals & rewards on the go" },
                  { icon: <ShieldIcon />, title: "Full transparency on promised vs. actual generation" },
                ].map((f) => (
                  <Box key={f.title} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "12px",
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: YELLOW,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {f.icon}
                    </Box>
                    <Typography sx={{ fontWeight: 600 }}>{f.title}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ============ TESTIMONIALS ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <SectionHead title={testimonials.heading} />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              justifyContent: "center",
              alignItems: "center",
              mt: -3,
              mb: 5,
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: "2.6rem", color: NAVY }}>
              {testimonials.googleRating}
            </Typography>
            <Rating value={testimonials.googleRating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ color: MUTED }}>
              Rated {testimonials.googleRating} on Google with{" "}
              {testimonials.googleReviews.toLocaleString("en-IN")}+ ratings
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {testimonials.items.map((t) => (
              <Grid key={t.name} size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "18px",
                    border: `1px solid ${LINE}`,
                    backgroundColor: SOFT,
                  }}
                >
                  <Typography sx={{ fontSize: "3rem", lineHeight: 0.6, color: YELLOW, fontWeight: 900 }}>
                    “
                  </Typography>
                  <Typography sx={{ mt: 1, mb: 3, flexGrow: 1, color: INK }}>
                    {t.quote}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar src={t.avatarUrl || undefined} sx={{ bgcolor: NAVY, fontWeight: 700 }}>
                      {t.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 800 }}>{t.name}</Typography>
                      <Typography variant="caption" sx={{ color: MUTED }}>
                        {t.location}
                      </Typography>
                    </Box>
                    <Rating value={t.rating} readOnly size="small" sx={{ ml: "auto" }} />
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ============ FAQ ============ */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, backgroundColor: SOFT }}>
        <Container maxWidth="md">
          <SectionHead eyebrow="FREQUENTLY ASKED QUESTIONS" title={faq.heading} />
          {faq.items.map((item, idx) => (
            <Accordion
              key={`${item.question}-${idx}`}
              elevation={0}
              disableGutters
              sx={{
                mb: 1.5,
                borderRadius: "14px !important",
                border: `1px solid ${LINE}`,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: NAVY }} />} sx={{ px: 3, py: 0.5 }}>
                <Typography sx={{ fontWeight: 700, color: NAVY }}>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 3, pb: 3 }}>
                <Typography sx={{ color: MUTED }}>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* ============ TALK TO A SOLAR EXPERT ============ */}
      <Box
        id="lead-form"
        sx={{
          py: { xs: 8, md: 12 },
          px: 2,
          backgroundImage: navyOverlay(IMG.fieldPanels, 0.9),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ color: "#FFFFFF" }}>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: "2rem", md: "3rem" }, lineHeight: 1.1 }}>
                Talk to a Solar Expert
              </Typography>
              <Typography sx={{ mt: 2, fontSize: "1.2rem", opacity: 0.9 }}>
                Save up to 90% on electricity bills by switching to solar now.
              </Typography>
              <Stack spacing={1.5} sx={{ mt: 4 }}>
                {["Free rooftop inspection & 3D design", "Subsidy paperwork handled end-to-end", "5-year free annual maintenance"].map((l) => (
                  <Box key={l} sx={{ display: "flex", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ color: YELLOW }} />
                    <Typography>{l}</Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: "20px", boxShadow: "0 30px 70px rgba(0,0,0,0.35)" }}>
                <Stack spacing={2}>
                  <TextField fullWidth label="Full Name" value={leadName} onChange={(e) => setLeadName(e.target.value)} sx={fieldSx} />
                  <TextField
                    fullWidth
                    label="WhatsApp Number"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
                    sx={fieldSx}
                  />
                  <TextField
                    select
                    fullWidth
                    label="Monthly Electricity Bill"
                    value={leadBillRange}
                    onChange={(e) => setLeadBillRange(e.target.value)}
                    sx={fieldSx}
                  >
                    {BILL_RANGES.map((r) => (
                      <MenuItem key={r} value={r}>
                        {r}
                      </MenuItem>
                    ))}
                  </TextField>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    onClick={() => void handleLeadSubmit()}
                    disabled={leadLoading}
                    sx={{ ...btn("yellow"), py: 1.7 }}
                  >
                    {leadLoading ? <CircularProgress size={22} sx={{ color: NAVY }} /> : "Submit Details"}
                  </Button>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={toastSeverity} onClose={() => setToast("")} variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}