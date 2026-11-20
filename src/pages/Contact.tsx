import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Stack,
  Button,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
  Chip,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import SendIcon from "@mui/icons-material/Send";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, type ReactElement, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { SITE_INFO } from "../config/SiteInfo";
import { submitLead } from "../config/Services";
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

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const WHY_CONTACT_US = [
  "Free rooftop inspection & 3D design",
  "Transparent pricing — zero middlemen",
  "Subsidy paperwork handled end-to-end",
  "5-year free annual maintenance",
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    "& fieldset": { borderColor: LINE },
    "&:hover fieldset": { borderColor: BLUE },
    "&.Mui-focused fieldset": { borderColor: NAVY },
  },
};

function InfoCard({
  icon,
  label,
  children,
}: {
  icon: ReactElement;
  label: string;
  children: ReactNode;
}) {
  return (
    <Card elevation={0} sx={{ p: 3, borderRadius: "16px", border: `1px solid ${LINE}` }}>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            bgcolor: NAVY,
            color: YELLOW,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="body2" sx={{ color: MUTED, fontWeight: 700, mb: 0.5 }}>
            {label}
          </Typography>
          {children}
        </Box>
      </Box>
    </Card>
  );
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const [toastSeverity, setToastSeverity] = useState<"success" | "error">("success");

  const submit = async (): Promise<void> => {
    if (!form.name.trim()) {
      setToastSeverity("error");
      setToast("Please enter your name");
      return;
    }
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      setToastSeverity("error");
      setToast("Enter a valid 10-digit phone number");
      return;
    }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setToastSeverity("error");
      setToast("Enter a valid email address");
      return;
    }
    if (!form.message.trim()) {
      setToastSeverity("error");
      setToast("Please add a short message");
      return;
    }

    setSubmitting(true);
    try {
      await submitLead({
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        pincode: "000000",
        monthlyBill: 0,
        message: `${form.message.trim()}${
          form.email.trim() ? ` | Email: ${form.email.trim()}` : ""
        }`,
      });
      setToastSeverity("success");
      setToast("Thanks! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setToastSeverity("error");
      setToast(
        err instanceof Error
          ? err.message
          : "Unable to send your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ fontFamily: FONT, backgroundColor: "#FFFFFF", color: INK }}>
      <PageHero
        eyebrow="CONTACT US"
        title="Let's talk about your solar plans."
        sub="Get clear answers, explore your rooftop options, or arrange a conversation with our solar team."
        image={IMG.society}
      />

      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 11 } }}>
        <Grid container spacing={5}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Stack spacing={2.5}>
              <InfoCard icon={<PhoneIcon />} label="Call Us">
                <Typography
                  component="a"
                  href={`tel:${SITE_INFO.phoneRaw}`}
                  sx={{ display: "block", color: INK, fontWeight: 800, textDecoration: "none", "&:hover": { color: BLUE } }}
                >
                  {SITE_INFO.phone}
                </Typography>
                <Typography variant="caption" sx={{ color: MUTED }}>
                  Mon–Sat: 9 AM – 7 PM IST
                </Typography>
              </InfoCard>
              <InfoCard icon={<EmailIcon />} label="Email Us">
                <Typography
                  component="a"
                  href={`mailto:${SITE_INFO.email}`}
                  sx={{ color: INK, fontWeight: 800, textDecoration: "none", wordBreak: "break-word", "&:hover": { color: BLUE } }}
                >
                  {SITE_INFO.email}
                </Typography>
              </InfoCard>
              <InfoCard icon={<LocationOnIcon />} label="Visit Us">
                <Typography sx={{ color: INK, fontWeight: 600 }}>{SITE_INFO.address.full}</Typography>
              </InfoCard>
              <InfoCard icon={<AccessTimeIcon />} label="Working Hours">
                <Typography sx={{ color: INK, fontWeight: 600 }}>{SITE_INFO.workingHours}</Typography>
              </InfoCard>
              <Card
                elevation={0}
                sx={{ p: 3, borderRadius: "16px", background: "linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.02))", border: "1px solid rgba(37,211,102,0.3)" }}
              >
                <Typography sx={{ fontWeight: 800, mb: 2 }}>
                  <WhatsAppIcon sx={{ verticalAlign: "middle", mr: 0.75, fontSize: 20 }} />
                  Prefer WhatsApp? Chat with us instantly.
                </Typography>
                <Button
                  fullWidth
                  href={`https://wa.me/${SITE_INFO.whatsappRaw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  sx={{ ...btn("yellow"), bgcolor: "#25D366", color: "#FFFFFF", "&:hover": { bgcolor: "#1DAA54" } }}
                >
                  Chat on WhatsApp
                </Button>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              elevation={0}
              sx={{ p: { xs: 3, md: 5 }, borderRadius: "22px", border: `1px solid ${LINE}`, boxShadow: "0 20px 60px rgba(11,37,89,0.1)" }}
            >
              <Typography variant="overline" sx={{ color: BLUE, fontWeight: 800, letterSpacing: "0.18em" }}>
                START A CONVERSATION
              </Typography>
              <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 1 }}>
                Request a solar consultation
              </Typography>
              <Typography sx={{ color: MUTED, mb: 3 }}>
                Fill in the form and our team will get back to you within 24 hours.
              </Typography>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email Address (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    slotProps={{ htmlInput: { maxLength: 10, inputMode: "numeric" } }}
                    required
                    sx={fieldSx}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Your Message" multiline rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required sx={fieldSx} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    disabled={submitting}
                    onClick={() => void submit()}
                    startIcon={submitting ? <CircularProgress size={20} sx={{ color: NAVY }} /> : <SendIcon />}
                    sx={{ ...btn("yellow"), py: 1.7 }}
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                </Grid>
              </Grid>
              <Stack spacing={1.2} sx={{ mt: 4, pt: 3, borderTop: `1px solid ${LINE}` }}>
                {WHY_CONTACT_US.map((line) => (
                  <Box key={line} sx={{ display: "flex", gap: 1.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 20, color: BLUE }} />
                    <Typography variant="body2" sx={{ color: MUTED }}>
                      {line}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: { xs: 7, md: 9 }, px: 2, backgroundColor: SOFT }}>
        <Container maxWidth="lg">
          <SectionHead eyebrow="SERVICE AREAS" title="We serve across Maharashtra" />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2, justifyContent: "center" }}>
            {SITE_INFO.serviceAreas.map((area) => (
              <Chip key={area} label={area} sx={{ bgcolor: "#FFFFFF", color: NAVY, fontWeight: 700, border: `1px solid ${LINE}` }} />
            ))}
          </Box>
        </Container>
      </Box>

      <CtaBand title="Visit our office" line={SITE_INFO.address.full}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE_INFO.address.full)}`}
            target="_blank"
            rel="noopener noreferrer"
            sx={btn("yellow")}
          >
            View on Map
          </Button>
          <Button component={RouterLink} to="/" variant="outlined" size="large" sx={btn("ghost")}>
            Calculate Savings
          </Button>
        </Stack>
      </CtaBand>

      <Snackbar open={Boolean(toast)} autoHideDuration={4000} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={toastSeverity} onClose={() => setToast("")} variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}