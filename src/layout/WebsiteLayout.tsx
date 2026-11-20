import { useState } from "react";
import { Link as RouterLink, Outlet, useLocation } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  Link,
  Fab,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SITE_INFO } from "../config/SiteInfo";
import {
  BLUE,
  FONT,
  IMG,
  INK,
  LINE,
  NAVY,
  NAVY_DEEP,
  YELLOW,
  btn,
  navyOverlay,
} from "../pages/SolarTheme";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Projects", to: "/media" },
  { label: "Contact", to: "/contact" },
];

const CONTACT_CTA = { label: "Free Site Visit", to: "/contact" };

export default function WebsiteLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (to: string): boolean =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const closeDrawer = (): void => setDrawerOpen(false);

  const social = [
    { icon: <FacebookIcon />, href: SITE_INFO.social.facebook, label: "Facebook" },
    { icon: <InstagramIcon />, href: SITE_INFO.social.instagram, label: "Instagram" },
    { icon: <YouTubeIcon />, href: SITE_INFO.social.youtube, label: "YouTube" },
    { icon: <LinkedInIcon />, href: SITE_INFO.social.linkedin, label: "LinkedIn" },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        fontFamily: FONT,
        backgroundColor: "#FFFFFF",
        color: INK,
      }}
    >
      {/* ===== Utility bar ===== */}
      {!isMobile && (
        <Box sx={{ backgroundColor: NAVY_DEEP, color: "rgba(255,255,255,0.9)" }}>
          <Container
            maxWidth="lg"
            sx={{
              py: 0.9,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.85rem",
            }}
          >
            <Stack direction="row" spacing={3} sx={{ alignItems: "center" }}>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <AccessTimeIcon sx={{ fontSize: 16, color: YELLOW }} />
                <span>{SITE_INFO.workingHours}</span>
              </Stack>
              <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                <EmailIcon sx={{ fontSize: 16, color: YELLOW }} />
                <Link href={`mailto:${SITE_INFO.email}`} underline="hover" sx={{ color: "inherit" }}>
                  {SITE_INFO.email}
                </Link>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
              <PhoneIcon sx={{ fontSize: 16, color: YELLOW }} />
              <Link href={`tel:${SITE_INFO.phoneRaw}`} underline="hover" sx={{ color: "inherit", fontWeight: 700 }}>
                {SITE_INFO.phone}
              </Link>
            </Stack>
          </Container>
        </Box>
      )}

      {/* ===== Main nav ===== */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#FFFFFF",
          color: INK,
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 76 } }}>
            <Stack
              direction="row"
              spacing={1.25}
              component={RouterLink}
              to="/"
              sx={{ alignItems: "center", textDecoration: "none", color: "inherit" }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: NAVY,
                  color: YELLOW,
                }}
              >
                <SolarPowerIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 800, lineHeight: 1.05, color: NAVY, fontSize: "1.2rem" }}>
                  {SITE_INFO.name}
                </Typography>
                <Typography variant="caption" sx={{ color: BLUE, fontWeight: 700, letterSpacing: "0.08em" }}>
                  SOLAR RTS EXPERTS
                </Typography>
              </Box>
            </Stack>

            <Box sx={{ flexGrow: 1 }} />

            {!isMobile && (
              <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <Button
                      key={link.to}
                      component={RouterLink}
                      to={link.to}
                      sx={{
                        color: active ? NAVY : "#344054",
                        fontWeight: active ? 800 : 600,
                        textTransform: "none",
                        fontSize: "0.98rem",
                        px: 1.75,
                        borderRadius: 0,
                        borderBottom: `3px solid ${active ? YELLOW : "transparent"}`,
                        "&:hover": { color: NAVY, backgroundColor: "transparent", borderBottomColor: YELLOW },
                      }}
                    >
                      {link.label}
                    </Button>
                  );
                })}
                <Button
                  component={RouterLink}
                  to={CONTACT_CTA.to}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ ...btn("yellow"), ml: 2, py: 1.1 }}
                >
                  {CONTACT_CTA.label}
                </Button>
              </Stack>
            )}

            {isMobile && (
              <IconButton aria-label="open navigation" onClick={() => setDrawerOpen(true)} sx={{ color: NAVY }}>
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* ===== Mobile drawer ===== */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={closeDrawer}
        slotProps={{ paper: { sx: { width: { xs: "85%", sm: 360 } } } }}
      >
        <Box sx={{ p: 2, backgroundColor: NAVY, color: "#FFFFFF" }}>
          <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between" }}>
            <Typography sx={{ fontWeight: 800, fontSize: "1.15rem" }}>{SITE_INFO.name}</Typography>
            <IconButton aria-label="close navigation" onClick={closeDrawer} sx={{ color: "#FFFFFF" }}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItem key={link.to} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={link.to}
                onClick={closeDrawer}
                selected={isActive(link.to)}
                sx={{
                  py: 1.5,
                  "&.Mui-selected": {
                    backgroundColor: "#F3F6FC",
                    color: NAVY,
                    borderLeft: `4px solid ${YELLOW}`,
                  },
                }}
              >
                <ListItemText
                  primary={link.label}
                  slotProps={{ primary: { sx: { fontWeight: isActive(link.to) ? 800 : 600 } } }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            component={RouterLink}
            to={CONTACT_CTA.to}
            variant="contained"
            fullWidth
            size="large"
            onClick={closeDrawer}
            sx={btn("yellow")}
          >
            {CONTACT_CTA.label}
          </Button>
          <Button
            href={`tel:${SITE_INFO.phoneRaw}`}
            fullWidth
            startIcon={<PhoneIcon />}
            sx={{ mt: 1.5, textTransform: "none", fontWeight: 700, color: NAVY }}
          >
            {SITE_INFO.phone}
          </Button>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* ===== Floating WhatsApp ===== */}
      <Fab
        component="a"
        href={`https://wa.me/${SITE_INFO.whatsappRaw}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        sx={{
          position: "fixed",
          right: { xs: 16, md: 28 },
          bottom: { xs: 16, md: 28 },
          bgcolor: "#25D366",
          color: "#FFFFFF",
          "&:hover": { bgcolor: "#1DAA54" },
          zIndex: 1200,
        }}
      >
        <WhatsAppIcon />
      </Fab>

      {/* ===== Footer ===== */}
      <Box
        component="footer"
        sx={{
          color: "rgba(255,255,255,0.88)",
          mt: "auto",
          backgroundImage: navyOverlay(IMG.panelsSky, 0.94),
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "2fr 1fr 1fr 1.6fr" },
              gap: 5,
            }}
          >
            <Box>
              <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "12px",
                    bgcolor: YELLOW,
                    color: INK,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <SolarPowerIcon />
                </Box>
                <Typography sx={{ fontWeight: 800, fontSize: "1.35rem", color: "#FFFFFF" }}>
                  {SITE_INFO.name}
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ opacity: 0.85, mb: 2.5, maxWidth: 340, lineHeight: 1.7 }}>
                {SITE_INFO.shortDescription}
              </Typography>
              <Stack direction="row" spacing={1}>
                {social.map((s) => (
                  <IconButton
                    key={s.label}
                    component="a"
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    sx={{
                      color: "#FFFFFF",
                      bgcolor: "rgba(255,255,255,0.1)",
                      "&:hover": { bgcolor: YELLOW, color: INK },
                    }}
                  >
                    {s.icon}
                  </IconButton>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, mb: 2, color: YELLOW, letterSpacing: "0.06em" }}>
                QUICK LINKS
              </Typography>
              <Stack spacing={1.2}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.to}
                    component={RouterLink}
                    to={link.to}
                    underline="hover"
                    sx={{ color: "rgba(255,255,255,0.88)" }}
                  >
                    {link.label}
                  </Link>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, mb: 2, color: YELLOW, letterSpacing: "0.06em" }}>
                SERVICE AREAS
              </Typography>
              <Stack spacing={1.2}>
                {SITE_INFO.serviceAreas.map((area) => (
                  <Typography key={area} variant="body2" sx={{ opacity: 0.88 }}>
                    {area}
                  </Typography>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 800, mb: 2, color: YELLOW, letterSpacing: "0.06em" }}>
                CONTACT
              </Typography>
              <Stack spacing={1.75}>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
                  <LocationOnIcon fontSize="small" sx={{ mt: 0.3, color: YELLOW }} />
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {SITE_INFO.address.full}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                  <PhoneIcon fontSize="small" sx={{ color: YELLOW }} />
                  <Link href={`tel:${SITE_INFO.phoneRaw}`} underline="hover" sx={{ color: "inherit" }}>
                    {SITE_INFO.phone}
                  </Link>
                </Stack>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
                  <EmailIcon fontSize="small" sx={{ color: YELLOW }} />
                  <Link href={`mailto:${SITE_INFO.email}`} underline="hover" sx={{ color: "inherit", wordBreak: "break-word" }}>
                    {SITE_INFO.email}
                  </Link>
                </Stack>
              </Stack>
            </Box>
          </Box>

          <Divider sx={{ my: 5, borderColor: "rgba(255,255,255,0.18)" }} />

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ justifyContent: "space-between", alignItems: { xs: "flex-start", md: "center" } }}
          >
            <Typography variant="body2" sx={{ opacity: 0.75 }}>
              © {new Date().getFullYear()} {SITE_INFO.legalName}. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                GSTIN: {SITE_INFO.gstin}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.75 }}>
                CIN: {SITE_INFO.cin}
              </Typography>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}