import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FlagIcon from "@mui/icons-material/Flag";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link as RouterLink } from "react-router-dom";
import { SITE_INFO } from "../config/SiteInfo";

const BRAND_GREEN = "#0B6B3A";
const BRAND_DARK = "#0B3D24";
const BRAND_AMBER = "#F5A623";

const STATS = [
  { value: "25,000+", label: "Homes Solarized" },
  { value: "90+ MW", label: "Capacity Installed" },
  { value: "10+", label: "Years of Experience" },
  { value: "₹1.2 Cr+", label: "Subsidy Delivered" },
];

const TEAM = [
  { name: "Suraj Kumbhar", role: "Founder & Director", phone: "+91 98765 43210" },
  { name: "Neeraj Patil", role: "Co-Founder & Operations Head", phone: "+91 98765 43211" },
  { name: "Shreya Mishra", role: "Head of Design & Engineering", phone: "+91 98765 43212" },
];

const VALUES = [
  {
    icon: <FlagIcon sx={{ fontSize: 32 }} />,
    title: "Our Mission",
    body: "Help more households and businesses adopt rooftop solar with clear advice, dependable installation, and responsive support.",
    color: BRAND_GREEN,
  },
  {
    icon: <VisibilityIcon sx={{ fontSize: 32 }} />,
    title: "Our Vision",
    body: "Build a future where clean rooftop energy is an easy, trusted choice for communities across Maharashtra.",
    color: BRAND_AMBER,
  },
  {
    icon: <CheckCircleIcon sx={{ fontSize: 32 }} />,
    title: "Why Choose Us",
    body: "Guidance from assessment to installation · Transparent system recommendations · Quality solar equipment · Lifetime support after switch-on.",
    color: "#2E7D32",
  },
];

export default function About() {
  return (
    <Box
      sx={{
        fontFamily:
          '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',
        backgroundColor: "#F7F9F7",
        color: "#1A1A1A",
      }}
    >
      {/* HERO */}
      <Box
        sx={{
          background:
            "linear-gradient(135deg, #0B6B3A 0%, #0B3D24 60%, #063018 100%)",
          color: "#FFFFFF",
          py: { xs: 8, md: 12 },
          px: 2,
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.2em", color: BRAND_AMBER, fontWeight: 700 }}
          >
            About Us
          </Typography>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "2rem", md: "3rem" },
              mt: 1,
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Solar energy, made personal.
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 400, opacity: 0.9, maxWidth: 720, mx: "auto" }}
          >
            A local solar team helping homes and businesses make a confident
            switch to cleaner energy.
          </Typography>
        </Container>
      </Box>

      {/* STORY */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip
              label="Our Story"
              sx={{
                bgcolor: "rgba(11,107,58,0.1)",
                color: BRAND_GREEN,
                fontWeight: 700,
                mb: 2,
              }}
            />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              A dependable team for your move to solar.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#4A4A4A", lineHeight: 1.8, mb: 2 }}
            >
              Arihant Electricals helps homes and businesses explore rooftop
              solar with practical advice, thoughtful system design, and
              hands-on installation support.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#4A4A4A", lineHeight: 1.8 }}
            >
              Our team also guides you through the documentation and
              coordination involved, so you have a clear point of contact
              throughout your solar journey.
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                background:
                  "linear-gradient(135deg, #0B6B3A 0%, #0B3D24 100%)",
                color: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 320,
                mb: 2,
              }}
            >
              <WorkspacePremiumIcon
                sx={{ fontSize: 140, color: BRAND_AMBER }}
              />
            </Box>
            <Grid container spacing={2}>
              {STATS.map((s) => (
                <Grid key={s.label} size={{ xs: 6 }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 2.5,
                      textAlign: "center",
                      border: "1px solid #E6E6E6",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: { xs: "1.25rem", md: "1.75rem" },
                        color: BRAND_GREEN,
                        lineHeight: 1,
                        mb: 0.5,
                      }}
                    >
                      {s.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#4A4A4A" }}>
                      {s.label}
                    </Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* VALUES */}
      <Box sx={{ py: { xs: 6, md: 10 }, px: 2, backgroundColor: "#FFFFFF" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 5 }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: "0.2em" }}
            >
              WHAT GUIDES US
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
              }}
            >
              Good solar starts with good people.
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "#4A4A4A", mt: 1, maxWidth: 640, mx: "auto" }}
            >
              We believe clean energy should be simple to understand and
              dependable for the long run.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {VALUES.map((v) => (
              <Grid key={v.title} size={{ xs: 12, md: 4 }}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2,
                    border: "1px solid #E6E6E6",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 3,
                        bgcolor: `${v.color}15`,
                        color: v.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      {v.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {v.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#4A4A4A", lineHeight: 1.7 }}
                    >
                      {v.body}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* TEAM */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: "0.2em" }}
          >
            MEET YOUR SOLAR TEAM
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mt: 1,
              fontSize: { xs: "1.75rem", md: "2.25rem" },
            }}
          >
            The people behind your project.
          </Typography>
        </Box>
        <Grid
          container
          spacing={4}
          sx={{ justifyContent: "center" }}
        >
          {TEAM.map((t) => (
            <Grid key={t.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                elevation={0}
                sx={{ p: 4, textAlign: "center", border: "1px solid #E6E6E6" }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: BRAND_GREEN,
                    fontSize: "2.5rem",
                    fontWeight: 700,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  {t.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {t.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: BRAND_GREEN, fontWeight: 600, mb: 1 }}
                >
                  {t.role}
                </Typography>
                <Typography variant="caption" sx={{ color: "#4A4A4A" }}>
                  {t.phone}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CERTIFICATIONS */}
      <Box sx={{ py: { xs: 6, md: 8 }, px: 2, backgroundColor: "#F7F9F7" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="overline"
              sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: "0.2em" }}
            >
              CERTIFICATIONS
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                mt: 1,
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              Trusted & Certified
            </Typography>
          </Box>
          <Grid
            container
            spacing={2}
            sx={{ justifyContent: "center" }}
          >
            {SITE_INFO.certifications.map((c) => (
              <Grid key={c} size={{ xs: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ p: 3, textAlign: "center", border: "1px solid #E6E6E6" }}
                >
                  <EmojiEventsIcon
                    sx={{ color: BRAND_GREEN, fontSize: 32, mb: 1 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1A1A1A" }}
                  >
                    {c}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          px: 2,
          backgroundColor: BRAND_DARK,
          color: "#FFFFFF",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              alignItems: { xs: "flex-start", md: "center" },
              justifyContent: "space-between",
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                Let's talk about your solar plans.
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.85 }}>
                Call {SITE_INFO.phone} or email {SITE_INFO.email}
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/contact"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: BRAND_AMBER,
                color: "#1A1A1A",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "999px",
                px: 4,
                "&:hover": { backgroundColor: "#FFC55C" },
              }}
            >
              Contact Us
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}