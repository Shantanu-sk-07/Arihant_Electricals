// src/pages/Media.tsx
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { JSX, useCallback, useEffect, useRef, useState } from "react";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import PlayIcon from "@mui/icons-material/PlayArrow";
import OpenIcon from "@mui/icons-material/OpenInNew";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import UploadIcon from "@mui/icons-material/CloudUpload";
import CategoryIcon from "@mui/icons-material/Category";
import SortIcon from "@mui/icons-material/Sort";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

import {
  PageHero,
  IMG,
  NAVY,
  LINE,
  FONT,
  INK,
  MUTED,
  SOFT,
} from "./SolarTheme";

const BRAND_GREEN = NAVY; // primary (navy)
const BRAND_LIGHT = LINE;

/* ------------------------------------------------------------------ */
/* Platform detection                                                  */
/* ------------------------------------------------------------------ */

type Platform =
  | "youtube"
  | "vimeo"
  | "instagram"
  | "tiktok"
  | "twitter"
  | "facebook"
  | "file"
  | "unknown";

function detectPlatform(url: string): Platform {
  if (!url) return "unknown";
  if (/youtube\.com|youtu\.be/.test(url)) return "youtube";
  if (/vimeo\.com/.test(url)) return "vimeo";
  if (/instagram\.com/.test(url)) return "instagram";
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/twitter\.com|x\.com/.test(url)) return "twitter";
  if (/facebook\.com|fb\.watch/.test(url)) return "facebook";
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) return "file";
  return "unknown";
}

function getPlatformMeta(platform: Platform): {
  label: string;
  color: string;
  icon: JSX.Element;
} {
  switch (platform) {
    case "youtube":
      return { label: "YouTube", color: "#FF0000", icon: <PlayIcon /> };
    case "vimeo":
      return { label: "Vimeo", color: "#1AB7EA", icon: <PlayIcon /> };
    case "instagram":
      return { label: "Instagram", color: "#E4405F", icon: <InstagramIcon /> };
    case "tiktok":
      return { label: "TikTok", color: "#000000", icon: <MusicNoteIcon /> };
    case "twitter":
      return { label: "X", color: "#000000", icon: <TwitterIcon /> };
    case "facebook":
      return { label: "Facebook", color: "#1877F2", icon: <FacebookIcon /> };
    case "file":
      return { label: "Video", color: BRAND_GREEN, icon: <UploadIcon /> };
    default:
      return { label: "Link", color: "#555555", icon: <CategoryIcon /> };
  }
}

function toYouTubeEmbed(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  let videoId: string | null = null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = trimmed.match(p);
    if (m) {
      videoId = m[1];
      break;
    }
  }
  if (!videoId) return trimmed;
  const params = new URLSearchParams({
    autoplay: "0",
    modestbranding: "1",
    rel: "0",
    controls: "1",
    playsinline: "1",
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function toVimeoEmbed(url: string): string {
  if (!url) return url;
  let videoId: string | null = null;
  const m1 = url.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (m1) videoId = m1[1];
  else {
    const m2 = url.match(/vimeo\.com\/(\d+)/);
    if (m2) videoId = m2[1];
  }
  if (!videoId) return url;
  const params = new URLSearchParams({
    autoplay: "0",
    byline: "0",
    portrait: "0",
    title: "0",
    controls: "1",
    playsinline: "1",
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

function toInstagramEmbed(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (!m) return null;
  return `https://www.instagram.com/p/${m[1]}/embed/`;
}

function toTikTokEmbed(url: string): string | null {
  const m = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (!m) return null;
  return `https://www.tiktok.com/embed/v2/${m[1]}`;
}

/* ------------------------------------------------------------------ */
/* Embedded players                                                    */
/* ------------------------------------------------------------------ */

function ExternalEmbed({
  url,
  platform,
  title,
  registerIframe,
}: {
  url: string;
  platform: "youtube" | "vimeo";
  title: string;
  registerIframe: (el: HTMLIFrameElement | null) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    registerIframe(iframeRef.current);
    return () => registerIframe(null);
  }, [registerIframe]);

  const src = platform === "youtube" ? toYouTubeEmbed(url) : toVimeoEmbed(url);
  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  );
}

function SocialEmbed({
  url,
  platform,
  registerIframe,
}: {
  url: string;
  platform: "instagram" | "tiktok";
  registerIframe: (el: HTMLIFrameElement | null) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    registerIframe(iframeRef.current);
    return () => registerIframe(null);
  }, [registerIframe]);

  const src =
    platform === "instagram" ? toInstagramEmbed(url) : toTikTokEmbed(url);
  if (!src) return <FallbackPreview url={url} />;

  return (
    <Box sx={{ width: "100%", height: "100%", overflow: "hidden", bgcolor: "#000" }}>
      <iframe
        ref={iframeRef}
        src={src}
        title={`${platform} embed`}
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
      />
    </Box>
  );
}

function DirectVideo({
  url,
  registerVideo,
  onPlay,
}: {
  url: string;
  registerVideo: (el: HTMLVideoElement | null) => void;
  onPlay: (el: HTMLVideoElement) => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    registerVideo(videoRef.current);
    return () => registerVideo(null);
  }, [registerVideo]);

  return (
    <Box
      component="video"
      ref={videoRef}
      src={url}
      controls
      preload="metadata"
      onPlay={(e) => onPlay(e.currentTarget)}
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        bgcolor: "#000",
      }}
    />
  );
}

function FallbackPreview({ url }: { url: string }) {
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        bgcolor: "#000",
        color: "#fff",
        textDecoration: "none",
        "&:hover .play-btn": { transform: "scale(1.1)" },
      }}
    >
      <Box
        className="play-btn"
        sx={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "transform 0.2s",
        }}
      >
        <PlayIcon sx={{ color: "#000", fontSize: 32 }} />
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

type VideoPlatformFilter =
  | "all"
  | "youtube"
  | "instagram"
  | "facebook"
  | "twitter"
  | "other";

type PhotoSort = "newest" | "oldest";

interface MediaItem {
  id: number | string;
  url: string;
  type: "image" | "video";
  title: string;
  description?: string;
  createdAt?: string;
  date?: string;
}

/* ------------------------------------------------------------------ */
/* Demo fallback media (shown when API returns nothing)                */
/* ------------------------------------------------------------------ */

const FALLBACK_MEDIA: MediaItem[] = [
  {
    id: 1,
    url: "https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=1200",
    type: "image",
    title: "Rooftop solar installation — Pune",
    description: "5 kW residential rooftop system",
    createdAt: "2024-10-01",
  },
  {
    id: 2,
    url: "https://images.pexels.com/photos/9875448/pexels-photo-9875448.jpeg?auto=compress&cs=tinysrgb&w=1200",
    type: "image",
    title: "WindPro Mount™ structure",
    description: "Tested for 170 kmph winds",
    createdAt: "2024-09-15",
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/2800832/pexels-photo-2800832.jpeg?auto=compress&cs=tinysrgb&w=1200",
    type: "image",
    title: "Solar panel cleaning",
    description: "Quarterly maintenance service",
    createdAt: "2024-08-20",
  },
  {
    id: 4,
    url: "https://images.pexels.com/photos/1591608/pexels-photo-1591608.jpeg?auto=compress&cs=tinysrgb&w=1200",
    type: "image",
    title: "Completed housing society project",
    description: "Group housing society installation",
    createdAt: "2024-07-10",
  },
];

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [typeFilter, setTypeFilter] = useState<"image" | "video">("image");
  const [platformFilter, setPlatformFilter] =
    useState<VideoPlatformFilter>("all");
  const [photoSort, setPhotoSort] = useState<PhotoSort>("newest");

  const activeVideos = useRef<Set<HTMLVideoElement>>(new Set());
  const activeIframes = useRef<Set<HTMLIFrameElement>>(new Set());

  const registerVideo = useCallback((el: HTMLVideoElement | null) => {
    if (el) activeVideos.current.add(el);
  }, []);
  const registerIframe = useCallback((el: HTMLIFrameElement | null) => {
    if (el) activeIframes.current.add(el);
  }, []);

  const pauseAllOthers = useCallback((current: HTMLVideoElement) => {
    activeVideos.current.forEach((v) => {
      if (v !== current && !v.paused) {
        v.pause();
        v.currentTime = 0;
      }
    });
    activeIframes.current.forEach((iframe) => {
      try {
        iframe.contentWindow?.postMessage(
          JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
          "*"
        );
        iframe.contentWindow?.postMessage(
          JSON.stringify({ method: "pause" }),
          "*"
        );
      } catch {
        /* ignore */
      }
    });
  }, []);

  useEffect(() => {
    const load = async (): Promise<void> => {
      try {
        const mod = await import("../config/Services");
        if (typeof mod.fetchMedia === "function") {
          const items = (await mod.fetchMedia()) as unknown as MediaItem[];
          if (items?.length) {
            setMedia(items);
            setLoading(false);
            return;
          }
        }
      } catch {
        /* ignore */
      }
      setMedia(FALLBACK_MEDIA);
      setLoading(false);
    };
    void load();
  }, []);

  const platformCounts = (() => {
    const counts: Record<VideoPlatformFilter, number> = {
      all: 0,
      youtube: 0,
      instagram: 0,
      facebook: 0,
      twitter: 0,
      other: 0,
    };
    media.forEach((m) => {
      if (m.type !== "video") return;
      const p = detectPlatform(m.url);
      if (p === "youtube") counts.youtube += 1;
      else if (p === "instagram") counts.instagram += 1;
      else if (p === "facebook") counts.facebook += 1;
      else if (p === "twitter") counts.twitter += 1;
      else counts.other += 1;
    });
    counts.all =
      counts.youtube +
      counts.instagram +
      counts.facebook +
      counts.twitter +
      counts.other;
    return counts;
  })();

  const getTimestamp = (m: MediaItem): number => {
    const raw = m.createdAt || m.date;
    if (raw) {
      const t = new Date(raw).getTime();
      if (!Number.isNaN(t)) return t;
    }
    const n = Number(m.id);
    return Number.isFinite(n) ? n : 0;
  };

  const filtered = (() => {
    let list = media.filter((m) => {
      if (m.type !== typeFilter) return false;
      if (typeFilter !== "video") return true;
      if (platformFilter === "all") return true;
      const p = detectPlatform(m.url);
      if (platformFilter === "youtube") return p === "youtube";
      if (platformFilter === "instagram") return p === "instagram";
      if (platformFilter === "facebook") return p === "facebook";
      if (platformFilter === "twitter") return p === "twitter";
      return (
        p !== "youtube" &&
        p !== "instagram" &&
        p !== "facebook" &&
        p !== "twitter"
      );
    });
    if (typeFilter === "image") {
      list = [...list].sort((a, b) => {
        const ta = getTimestamp(a);
        const tb = getTimestamp(b);
        return photoSort === "newest" ? tb - ta : ta - tb;
      });
    }
    return list;
  })();

  const isTallMode = typeFilter === "video" && platformFilter !== "all";

  const mediaHeightSx = isTallMode
    ? { xs: 260, sm: 300, md: 480 }
    : { xs: 180, sm: 200, md: 220 };

  return (
    <Box
      sx={{
        fontFamily: FONT,
        backgroundColor: SOFT,
        color: INK,
      }}
    >
      {/* ============ HERO ============ */}
      <PageHero
        eyebrow="MEDIA"
        title="Rooftop solar in action."
        sub="Browse solar projects, panels, and the clean-energy work happening across Maharashtra."
        image={IMG.fieldPanels}
      />

      {/* ============ GALLERY ============ */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 10 } }}>
        <Stack spacing={1} sx={{ alignItems: "center", mb: 4 }}>
          <Typography
            variant="overline"
            sx={{ color: BRAND_GREEN, fontWeight: 700, letterSpacing: "0.2em" }}
          >
            GALLERY
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", md: "2rem" },
              textAlign: "center",
            }}
          >
            A closer look at solar
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: MUTED, textAlign: "center", maxWidth: 640 }}
          >
            Explore installation highlights and real-world rooftop solar
            stories.
          </Typography>
        </Stack>

        {/* Tabs */}
        <Stack sx={{ mb: { xs: 2, md: 3 }, alignItems: "center" }}>
          <Tabs
            value={typeFilter}
            onChange={(_, v) => setTypeFilter(v as "image" | "video")}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              bgcolor: "#F1F5F1",
              borderRadius: 3,
              p: 0.5,
              minHeight: "auto",
              "& .MuiTabs-indicator": { display: "none" },
              "& .MuiTab-root": {
                minHeight: 40,
                borderRadius: 2.5,
                mx: 0.5,
                color: "#4A4A4A",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                textTransform: "none",
                "&.Mui-selected": { bgcolor: BRAND_GREEN, color: "#FFFFFF" },
              },
            }}
          >
            <Tab
              icon={<ImageIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Photos"
              value="image"
            />
            <Tab
              icon={<VideoLibraryIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Videos"
              value="video"
            />
          </Tabs>
        </Stack>

        {/* Video platform filter */}
        {typeFilter === "video" && platformCounts.all > 0 && (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mb: 4,
              overflowX: "auto",
              justifyContent: "center",
              pb: 1,
            }}
          >
            {(
              [
                { id: "all", label: "All", color: BRAND_GREEN },
                { id: "youtube", label: "YouTube", color: "#FF0000" },
                { id: "instagram", label: "Instagram", color: "#E4405F" },
                { id: "facebook", label: "Facebook", color: "#1877F2" },
                { id: "twitter", label: "X", color: "#000000" },
                { id: "other", label: "Other", color: "#555555" },
              ] as { id: VideoPlatformFilter; label: string; color: string }[]
            ).map((f) => {
              const active = platformFilter === f.id;
              const count = platformCounts[f.id] ?? 0;
              return (
                <Tooltip key={f.id} title={`${f.label} · ${count}`}>
                  <span>
                    <Button
                      onClick={() => setPlatformFilter(f.id)}
                      size="small"
                      disabled={count === 0 && f.id !== "all"}
                      sx={{
                        textTransform: "none",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        borderRadius: 2,
                        px: 2,
                        py: 0.6,
                        border: "1px solid",
                        borderColor: active ? f.color : BRAND_LIGHT,
                        bgcolor: active ? f.color : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#4A4A4A",
                        "&:hover": {
                          bgcolor: active ? f.color : `${f.color}15`,
                          borderColor: f.color,
                          color: active ? "#FFFFFF" : f.color,
                        },
                        "&.Mui-disabled": {
                          opacity: 0.4,
                          color: "#94A3B8",
                        },
                      }}
                    >
                      {f.label}
                      {count > 0 && (
                        <Box
                          component="span"
                          sx={{
                            ml: 0.6,
                            px: 0.55,
                            py: 0.05,
                            borderRadius: 1,
                            fontSize: "0.62rem",
                            bgcolor: active
                              ? "rgba(255,255,255,0.25)"
                              : `${f.color}22`,
                            color: active ? "#FFFFFF" : f.color,
                            fontWeight: 800,
                          }}
                        >
                          {count}
                        </Box>
                      )}
                    </Button>
                  </span>
                </Tooltip>
              );
            })}
          </Box>
        )}

        {/* Photo sort */}
        {typeFilter === "image" && (
          <Box sx={{ display: "flex", mb: 4, justifyContent: "center" }}>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel
                id="sort-label"
                sx={{ fontSize: "0.8rem", fontWeight: 600 }}
              >
                <SortIcon
                  sx={{ fontSize: 14, mr: 0.5, verticalAlign: "middle" }}
                />
                Sort Photos
              </InputLabel>
              <Select
                labelId="sort-label"
                value={photoSort}
                label="Sort Photos"
                onChange={(e) => setPhotoSort(e.target.value as PhotoSort)}
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: "#FFFFFF",
                  "& .MuiSelect-select": { py: 0.9 },
                }}
              >
                <MenuItem value="newest" sx={{ fontSize: "0.85rem" }}>
                  Newest first
                </MenuItem>
                <MenuItem value="oldest" sx={{ fontSize: "0.85rem" }}>
                  Oldest first
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: BRAND_GREEN }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ color: "#4A4A4A" }}>
              No {typeFilter === "image" ? "photos" : "videos"} yet.
            </Typography>
          </Box>
        ) : (
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            sx={{ alignItems: "stretch" }}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((m, i) => {
                const platform = detectPlatform(m.url);
                const meta = getPlatformMeta(platform);
                const isFileVideo = m.type === "video" && platform === "file";
                const isYtVimeo =
                  m.type === "video" &&
                  (platform === "youtube" || platform === "vimeo");
                const isSocial =
                  m.type === "video" &&
                  (platform === "instagram" || platform === "tiktok");
                const isFallback =
                  m.type === "video" &&
                  (platform === "twitter" ||
                    platform === "facebook" ||
                    platform === "unknown");

                return (
                  <Grid
                    size={{ xs: 12, sm: 6, md: 6, lg: 4 }}
                    key={m.id}
                    sx={{ display: "flex" }}
                  >
                    <Card
                      component={motion.div}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      elevation={0}
                      sx={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        border: `1px solid ${BRAND_LIGHT}`,
                        overflow: "hidden",
                        transition: "all 0.3s",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "0 16px 40px rgba(11,107,58,0.12)",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          px: { xs: 1.25, md: 1.5 },
                          pt: { xs: 1.25, md: 1.5 },
                          pb: 0.75,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 700,
                            fontSize: { xs: "0.9rem", md: "1rem" },
                            lineHeight: 1.3,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            mb: m.description ? 0.5 : 0,
                          }}
                        >
                          {m.title}
                        </Typography>
                        {m.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: "0.72rem", md: "0.78rem" },
                              color: "#4A4A4A",
                              lineHeight: 1.4,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {m.description}
                          </Typography>
                        )}
                      </Box>

                      <Box
                        sx={{
                          height: mediaHeightSx,
                          maxHeight: mediaHeightSx,
                          minHeight: mediaHeightSx,
                          flexShrink: 0,
                          bgcolor: "#000",
                          position: "relative",
                          overflow: "hidden",
                          transition: "height 0.35s ease",
                        }}
                      >
                        {m.type === "image" && (
                          <CardMedia
                            component="img"
                            image={m.url}
                            alt={m.title}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        )}
                        {isFileVideo && (
                          <DirectVideo
                            url={m.url}
                            registerVideo={registerVideo}
                            onPlay={pauseAllOthers}
                          />
                        )}
                        {isYtVimeo && (
                          <ExternalEmbed
                            url={m.url}
                            platform={platform as "youtube" | "vimeo"}
                            title={m.title}
                            registerIframe={registerIframe}
                          />
                        )}
                        {isSocial && (
                          <SocialEmbed
                            url={m.url}
                            platform={platform as "instagram" | "tiktok"}
                            registerIframe={registerIframe}
                          />
                        )}
                        {isFallback && <FallbackPreview url={m.url} />}
                      </Box>

                      {m.type === "video" && (
                        <Box sx={{ px: 1.5, py: 1.25 }}>
                          <Button
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth
                            size="small"
                            startIcon={meta.icon}
                            endIcon={<OpenIcon sx={{ fontSize: 14 }} />}
                            sx={{
                              textTransform: "none",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              py: 0.7,
                              borderRadius: 1.5,
                              bgcolor: meta.color,
                              color: "#FFFFFF",
                              "&:hover": {
                                bgcolor: meta.color,
                                filter: "brightness(0.9)",
                              },
                            }}
                          >
                            Watch on {meta.label}
                          </Button>
                        </Box>
                      )}
                    </Card>
                  </Grid>
                );
              })}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
}