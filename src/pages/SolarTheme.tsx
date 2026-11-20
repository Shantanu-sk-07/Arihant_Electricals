/* eslint-disable react-refresh/only-export-components */
import { useState, type ReactNode } from "react";
import { Box, Container, Typography } from "@mui/material";
import { SITE_INFO } from "../config/SiteInfo";

export const SKY = "#0EA5E9";
export const SKY_DARK = "#0369A1";
export const SKY_LIGHT = "#E0F2FE";
export const SKY_SOFT = "#F3F9FD";
export const NAVY = "#0B2540";
export const NAVY_DEEP = "#071A2E";
export const SUN = "#FBBF24";
export const SUN_HOVER = "#FCD34D";
export const INK = "#0F2A3F";
export const MUTED = "#5B6B7A";
export const LINE = "#DCEAF3";

export const BLUE = SKY;
export const YELLOW = SUN;
export const YELLOW_HOVER = SUN_HOVER;
export const SOFT = SKY_SOFT;

export const FONT =
  '"Manrope", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
export const HEADING_FONT =
  '"Sora", "Manrope", "Segoe UI", Roboto, Arial, sans-serif';

export const LOGO_URL = "https://YOUR-HOST.com/arihant-electricals-logo.png";

export const SERVICE_DISTRICTS = [
  "Kolhapur",
  "Sangli",
  "Satara",
] as const;

const photo = (id: number, w = 1800): string =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

export const IMG = {
  heroRooftop: photo(9875408, 2000),
  installers: photo(9875411, 1600),
  society: photo(9875441, 1600),
  closeUp: photo(9875405, 1600),
  panelsSky: photo(371900, 2000),
  fieldPanels: photo(356036, 1600),
  commercial: photo(4320473, 1600),
  wide: photo(13627639, 1600),
};

export const navyOverlay = (img: string, a = 0.85): string =>
  `linear-gradient(90deg, rgba(7,26,46,${a}) 0%, rgba(7,26,46,${(a * 0.5).toFixed(
    2
  )}) 45%, rgba(7,26,46,0) 75%), url('${img}')`;

type BtnKind = "yellow" | "sky" | "navy" | "ghost" | "light";

export const btn = (kind: BtnKind = "yellow") => ({
  textTransform: "none" as const,
  fontWeight: 700,
  borderRadius: "12px",
  px: 3.5,
  py: 1.4,
  fontSize: "1rem",
  boxShadow: "none",
  transition:
    "transform .25s ease, background-color .25s ease, box-shadow .25s ease, color .25s ease",
  ...(kind === "yellow" && {
    backgroundColor: SUN,
    color: NAVY,
    "&:hover": {
      backgroundColor: SUN_HOVER,
      boxShadow: "0 12px 24px rgba(251,191,36,0.35)",
      transform: "translateY(-2px)",
    },
  }),
  ...(kind === "sky" && {
    backgroundColor: SKY,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: SKY_DARK,
      boxShadow: "0 12px 24px rgba(14,165,233,0.35)",
      transform: "translateY(-2px)",
    },
  }),
  ...(kind === "navy" && {
    backgroundColor: NAVY,
    color: "#FFFFFF",
    "&:hover": {
      backgroundColor: NAVY_DEEP,
      boxShadow: "0 12px 24px rgba(11,37,64,0.3)",
      transform: "translateY(-2px)",
    },
  }),
  ...(kind === "light" && {
    backgroundColor: "#FFFFFF",
    color: NAVY,
    "&:hover": { backgroundColor: SKY_SOFT, transform: "translateY(-2px)" },
  }),
  ...(kind === "ghost" && {
    border: "1.5px solid rgba(255,255,255,0.8)",
    color: "#FFFFFF",
    "&:hover": { borderColor: SUN, color: SUN, transform: "translateY(-2px)" },
  }),
});

export function BrandLogo({ height = 52 }: { height?: number }) {
  const [failed, setFailed] = useState<boolean>(false);
  if (failed) {
    return (
      <Typography
        sx={{
          fontFamily: HEADING_FONT,
          fontWeight: 800,
          fontSize: "1.2rem",
          color: NAVY,
          lineHeight: 1.1,
          whiteSpace: "nowrap",
        }}
      >
        {SITE_INFO.name}
      </Typography>
    );
  }
  return (
    <Box
      component="img"
      src={LOGO_URL}
      alt={`${SITE_INFO.name} logo`}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      sx={{ height, width: "auto", maxWidth: "100%", display: "block" }}
    />
  );
}

export function SectionHead({
  eyebrow,
  title,
  sub,
  align = "center",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
  light?: boolean;
}) {
  return (
    <Box sx={{ textAlign: align, mb: { xs: 4, md: 6 } }}>
      {eyebrow && (
        <Typography sx={{ color: light ? SUN : SKY_DARK, fontWeight: 700, mb: 1 }}>
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h2"
        sx={{
          fontFamily: HEADING_FONT,
          fontWeight: 800,
          fontSize: { xs: "1.9rem", md: "2.6rem" },
          lineHeight: 1.15,
          color: light ? "#FFFFFF" : NAVY,
        }}
      >
        {title}
      </Typography>
      {sub && (
        <Typography
          sx={{
            mt: 1.5,
            color: light ? "rgba(255,255,255,0.88)" : MUTED,
            maxWidth: 680,
            mx: align === "center" ? "auto" : 0,
            lineHeight: 1.7,
            fontSize: "1.05rem",
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  );
}

export function PageHero({
  eyebrow,
  title,
  sub,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  sub: string;
  image: string;
  children?: ReactNode;
}) {
  return (
    <Box
      sx={{
        color: "#FFFFFF",
        py: { xs: 9, md: 14 },
        px: 2,
        backgroundImage: navyOverlay(image, 0.88),
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container maxWidth="lg" sx={{ animation: "riseIn .8s ease both" }}>
        <Typography sx={{ color: SUN, fontWeight: 700, mb: 1 }}>{eyebrow}</Typography>
        <Typography
          variant="h1"
          sx={{
            fontFamily: HEADING_FONT,
            fontWeight: 800,
            fontSize: { xs: "2.1rem", md: "3.5rem" },
            lineHeight: 1.08,
            maxWidth: 820,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            mt: 2.5,
            opacity: 0.92,
            lineHeight: 1.7,
            fontSize: { xs: "1rem", md: "1.2rem" },
            maxWidth: 680,
          }}
        >
          {sub}
        </Typography>
        {children && <Box sx={{ mt: 4 }}>{children}</Box>}
      </Container>
    </Box>
  );
}

export function CtaBand({
  title,
  line,
  children,
}: {
  title: string;
  line: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        py: { xs: 7, md: 9 },
        px: 2,
        color: "#FFFFFF",
        backgroundImage: navyOverlay(IMG.fieldPanels, 0.9),
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="h3" sx={{ fontFamily: HEADING_FONT, fontWeight: 800, fontSize: { xs: "1.6rem", md: "2rem" }, mb: 1 }}>
            {title}
          </Typography>
          <Typography sx={{ opacity: 0.9 }}>{line}</Typography>
        </Box>
        {children}
      </Container>
    </Box>
  );
}