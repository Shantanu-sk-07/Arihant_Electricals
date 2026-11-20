import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  Grid,
  Stack,
  Chip,
} from "@mui/material";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import HandymanIcon from "@mui/icons-material/Handyman";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import type { ReactElement } from "react";
import { SITE_INFO } from "../config/SiteInfo";
import {
  BLUE,
  CtaBand,
  FONT,
  IMG,
  INK,
  LINE,
  MUTED,
  NAVY,
  PageHero,
  SOFT,
  YELLOW,
  SectionHead,
  btn,
} from "./SolarTheme";

interface ServiceItem {
  icon: ReactElement;
  title: string;
  description: string;
  features: string[];
  image: string;
}

const SERVICES: ServiceItem[] = [
  {
    icon: <DesignServicesIcon sx={{ fontSize: 30 }} />,
    title: "Rooftop Inspection & 3D Design",
    description:
      "Our solar consultants visit your site, evaluate roof type, structural strength, and ideal tilt angle — then deliver a personalised 3D rooftop design within 30 minutes of inspection.",
    features: [
      "Free rooftop inspection",
      "3D model of your home with solar layout",
      "Shadow analysis for optimal placement",
      "Structural strength assessment",
    ],
    image: IMG.heroRooftop,
  },
  {
    icon: <HandymanIcon sx={{ fontSize: 30 }} />,
    title: "Residential Solar Installation",
    description:
      "Seamless installation with strong, chemically anchored mounting structures. Our WindPro Mount™ is tested for 170 kmph storms.",
    features: [
      "1-day installation after design approval",
      "WindPro Mount™ storm-proof structure",
      "Non-penetrating, waterproof solutions",
      "Complete AC/DC cabling and earthing",
    ],
    image: IMG.installers,
  },
  {
    icon: <AccountBalanceIcon sx={{ fontSize: 30 }} />,
    title: "Easy Financing & Subsidy",
    description:
      "We handle the entire subsidy process from application to disbursement. Flexible EMI options with collateral-free loans from partner banks.",
    features: [
      "Up to ₹78,000 government subsidy",
      "10-minute hassle-free loan approval",
      "Interest-free 6-month EMI",
      "5-year EMI in 60 easy installments",
    ],
    image: IMG.society,
  },
  {
    icon: <SupportAgentIcon sx={{ fontSize: 30 }} />,
    title: "Annual Maintenance Contract",
    description:
      "Free 5-year annual maintenance contract with every installation. Proactive quarterly cleaning and preventive maintenance for steady performance.",
    features: [
      "Quarterly panel cleaning",
      "Preventive and corrective maintenance",
      "Generation efficiency monitoring",
      "Real-time app-based tracking",
    ],
    image: IMG.closeUp,
  },
];

const PROCESS_STEPS = [
  { step: "1", title: "Free Consultation", description: "Share your electricity bill and pincode. Our team evaluates your requirement." },
  { step: "2", title: "Site Inspection", description: "Our consultant visits your rooftop and prepares a 3D solar design." },
  { step: "3", title: "Design Approval", description: "You review and approve the 3D design, system size, and financing plan." },
  { step: "4", title: "Installation", description: "Complete installation in 1 day with storm-proof mounting structures." },
  { step: "5", title: "Subsidy & Handover", description: "We process your subsidy and hand over the monitoring app access." },
];

export default function Services() {
  return (
    <Box sx={{ fontFamily: FONT, backgroundColor: "#FFFFFF", color: INK }}>
      <PageHero
        eyebrow="OUR SERVICES"
        title="End-to-end solar solutions. Zero middlemen."
        sub="From rooftop inspection to installation, subsidy and maintenance — we handle everything so you just save."
        image={IMG.installers}
      >
        <Button
          component={RouterLink}
          to="/contact"
          size="large"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={btn("yellow")}
        >
          Get Free Quote
        </Button>
      </PageHero>

      {/* Service blocks — alternating photo / content like SolarSquare */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Stack spacing={{ xs: 6, md: 10 }}>
            {SERVICES.map((s, i) => (
              <Grid
                key={s.title}
                container
                spacing={{ xs: 3, md: 7 }}
                sx={{ alignItems: "center", flexDirection: { md: i % 2 ? "row-reverse" : "row" } }}
              >
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      borderRadius: "24px",
                      minHeight: { xs: 240, md: 360 },
                      backgroundImage: `linear-gradient(180deg, rgba(7,26,64,0) 55%, rgba(7,26,64,0.6) 100%), url('${s.image}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      boxShadow: "0 24px 60px rgba(11,37,89,0.18)",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "14px",
                      bgcolor: NAVY,
                      color: YELLOW,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {s.icon}
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: { xs: "1.6rem", md: "2.1rem" }, lineHeight: 1.15, mb: 1.5 }}>
                    <Box component="span" sx={{ color: BLUE, mr: 1 }}>
                      #{i + 1}
                    </Box>
                    {s.title}
                  </Typography>
                  <Typography sx={{ color: MUTED, mb: 3 }}>{s.description}</Typography>
                  <Stack spacing={1.3}>
                    {s.features.map((f) => (
                      <Box key={f} sx={{ display: "flex", gap: 1.5 }}>
                        <CheckCircleIcon sx={{ color: BLUE, fontSize: 22 }} />
                        <Typography>{f}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Process */}
      <Box sx={{ py: { xs: 8, md: 12 }, px: 2, backgroundColor: SOFT }}>
        <Container maxWidth="lg">
          <SectionHead
            eyebrow="HOW IT WORKS"
            title="Five simple steps from enquiry to installation"
          />
          <Grid container spacing={2.5}>
            {PROCESS_STEPS.map((p) => (
              <Grid key={p.step} size={{ xs: 12, sm: 6, md: 2.4 }}>
                <Card elevation={0} sx={{ p: 3, height: "100%", borderRadius: "18px", border: `1px solid ${LINE}` }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
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
                    {p.step}
                  </Box>
                  <Typography sx={{ fontWeight: 800, color: NAVY, mb: 0.5 }}>{p.title}</Typography>
                  <Typography variant="body2" sx={{ color: MUTED }}>
                    {p.description}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Service areas */}
      <Box sx={{ py: { xs: 8, md: 10 }, px: 2 }}>
        <Container maxWidth="lg">
          <SectionHead
            eyebrow="WE SERVE ACROSS MAHARASHTRA"
            title={`Solar experts in ${SITE_INFO.serviceAreas.length}+ cities`}
            sub="Dedicated installation and service teams close to you."
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, justifyContent: "center" }}>
            {SITE_INFO.serviceAreas.map((area) => (
              <Chip
                key={area}
                label={area}
                sx={{ bgcolor: SOFT, color: NAVY, fontWeight: 700, border: `1px solid ${LINE}`, px: 0.5 }}
              />
            ))}
          </Box>
        </Container>
      </Box>

      <CtaBand
        title="Ready to go solar?"
        line={`Call ${SITE_INFO.phone} or email ${SITE_INFO.email}`}
      >
        <Button
          component={RouterLink}
          to="/contact"
          size="large"
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={btn("yellow")}
        >
          Book Free Visit
        </Button>
      </CtaBand>
    </Box>
  );
}