import {
  Box, Container, Grid, Typography, Card, CardMedia, 
  Stack, Tabs, Tab, CircularProgress, Button,
  Tooltip, FormControl, Select, MenuItem, InputLabel,
  useMediaQuery, useTheme,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image as ImageIcon,
  VideoLibrary,
  PlayArrow as PlayIcon,
  OpenInNew as OpenIcon,
  Instagram as InstagramIcon,
  MusicNote as TikTokIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
  CloudUpload as UploadIcon,
  Category as OtherIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useMedia } from '../hooks/useMedia';
import SectionTitle from '../components/SectionTitle';
import { BRAND, SHADOW } from '@/constants/Brand';
import { useContent } from '@/hooks/useContent';

/* ---------- SIZES ---------- */
const MEDIA_HEIGHT_COMPACT = 220;
const MEDIA_HEIGHT_TALL = 480;
const FILTER_ICON_SIZE = 16;

/* ============================================================
   PLATFORM DETECTION
   ============================================================ */

type Platform =
  | 'youtube'
  | 'vimeo'
  | 'instagram'
  | 'tiktok'
  | 'twitter'
  | 'facebook'
  | 'file'
  | 'unknown';

function detectPlatform(url: string): Platform {
  if (!url) return 'unknown';
  if (/youtube\.com|youtu\.be/.test(url)) return 'youtube';
  if (/vimeo\.com/.test(url)) return 'vimeo';
  if (/instagram\.com/.test(url)) return 'instagram';
  if (/tiktok\.com/.test(url)) return 'tiktok';
  if (/twitter\.com|x\.com/.test(url)) return 'twitter';
  if (/facebook\.com|fb\.watch/.test(url)) return 'facebook';
  if (/\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(url)) return 'file';
  return 'unknown';
}

/* ---------- PLATFORM LABEL + COLOR ---------- */
function getPlatformMeta(platform: Platform) {
  switch (platform) {
    case 'youtube':
      return { label: 'YouTube', color: '#FF0000', icon: <PlayIcon /> };
    case 'vimeo':
      return { label: 'Vimeo', color: '#1AB7EA', icon: <PlayIcon /> };
    case 'instagram':
      return { label: 'Instagram', color: '#E4405F', icon: <InstagramIcon /> };
    case 'tiktok':
      return { label: 'TikTok', color: '#000000', icon: <TikTokIcon /> };
    case 'twitter':
      return { label: 'X', color: '#000000', icon: <TwitterIcon /> };
    case 'facebook':
      return { label: 'Facebook', color: '#1877F2', icon: <FacebookIcon /> };
    case 'file':
      return { label: 'Video', color: BRAND.primary, icon: <UploadIcon /> };
    default:
      return { label: 'Link', color: '#555555', icon: <OtherIcon /> };
  }
}

/* --- YouTube --- */
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
    autoplay: '0',
    modestbranding: '1',
    rel: '0',
    showinfo: '0',
    controls: '1',
    iv_load_policy: '3',
    playsinline: '1',
  });
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

/* --- Vimeo --- */
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
    autoplay: '0',
    byline: '0',
    portrait: '0',
    title: '0',
    controls: '1',
    playsinline: '1',
  });
  return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
}

/* --- Instagram --- */
function toInstagramEmbed(url: string): string | null {
  const m = url.match(/instagram\.com\/(?:p|reel|reels|tv)\/([A-Za-z0-9_-]+)/);
  if (!m) return null;
  return `https://www.instagram.com/p/${m[1]}/embed/`;
}

/* --- TikTok --- */
function toTikTokEmbed(url: string): string | null {
  const m = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  if (!m) return null;
  return `https://www.tiktok.com/embed/v2/${m[1]}`;
}

/* ============================================================
   CLEAN SOCIAL EMBED
   ============================================================ */

interface CleanEmbedProps {
  url: string;
  platform: 'instagram' | 'tiktok';
  registerPlayer?: (el: HTMLIFrameElement | null) => void;
}

function CleanSocialEmbed({ url, platform, registerPlayer }: CleanEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const src =
    platform === 'instagram' ? toInstagramEmbed(url) : toTikTokEmbed(url);

  useEffect(() => {
    if (registerPlayer) {
      registerPlayer(iframeRef.current);
      return () => registerPlayer(null);
    }
  }, [registerPlayer]);

  if (!src) {
    return <FallbackPreview url={url} />;
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: '#000',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title={`${platform} video`}
        scrolling="no"
        allow="autoplay; encrypted-media; picture-in-picture; clipboard-write"
        allowFullScreen
        style={{
          width: '100%',
          height: '100%',
          border: 0,
          display: 'block',
          background: '#000',
        }}
      />
    </Box>
  );
}

/* ============================================================
   YOUTUBE / VIMEO
   ============================================================ */

interface ExternalEmbedProps {
  url: string;
  platform: 'youtube' | 'vimeo';
  title: string;
  registerPlayer: (el: HTMLIFrameElement | null) => void;
}

function ExternalEmbed({ url, platform, title, registerPlayer }: ExternalEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    registerPlayer(iframeRef.current);
    return () => registerPlayer(null);
  }, [registerPlayer]);

  const src = platform === 'youtube' ? toYouTubeEmbed(url) : toVimeoEmbed(url);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title={title}
    />
  );
}

/* ============================================================
   DIRECT VIDEO FILE
   ============================================================ */

interface DirectVideoProps {
  url: string;
  registerVideo: (el: HTMLVideoElement | null) => void;
  onPlay: (el: HTMLVideoElement) => void;
}

function DirectVideo({ url, registerVideo, onPlay }: DirectVideoProps) {
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
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        bgcolor: '#000',
      }}
    />
  );
}

/* ============================================================
   FALLBACK PREVIEW
   ============================================================ */

function FallbackPreview({ url }: { url: string }) {
  return (
    <Box
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        bgcolor: '#000',
        color: '#fff',
        textDecoration: 'none',
        position: 'relative',
        '&:hover .play-btn': { transform: 'scale(1.1)' },
      }}
    >
      <Box
        className="play-btn"
        sx={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          bgcolor: 'rgba(255,255,255,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.2s',
        }}
      >
        <PlayIcon sx={{ color: '#000', fontSize: 32 }} />
      </Box>
    </Box>
  );
}

/* ============================================================
   VIDEO PLATFORM FILTER
   ============================================================ */

type VideoPlatformFilter =
  | 'all'
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'other';

interface PlatformFilterRowProps {
  value: VideoPlatformFilter;
  onChange: (next: VideoPlatformFilter) => void;
  counts: Record<VideoPlatformFilter, number>;
}

function PlatformFilterRow({ value, onChange, counts }: PlatformFilterRowProps) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));

  const iconSx = { fontSize: isCompact ? 20 : FILTER_ICON_SIZE };

  const filters: {
    id: VideoPlatformFilter;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    { id: 'all', label: 'All', icon: <VideoLibrary sx={iconSx} />, color: BRAND.primary },
    { id: 'youtube', label: 'YouTube', icon: <PlayIcon sx={iconSx} />, color: '#FF0000' },
    { id: 'instagram', label: 'Instagram', icon: <InstagramIcon sx={iconSx} />, color: '#E4405F' },
    { id: 'facebook', label: 'Facebook', icon: <FacebookIcon sx={iconSx} />, color: '#1877F2' },
    { id: 'twitter', label: 'X', icon: <TwitterIcon sx={iconSx} />, color: '#000000' },
    { id: 'other', label: 'Other', icon: <OtherIcon sx={iconSx} />, color: '#555555' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        gap: isCompact ? 0.75 : 1,
        mb: 4,
        overflowX: 'auto',
        px: 0.5,
        pb: 1,
        justifyContent: { xs: 'center', md: 'center' },
        '&::-webkit-scrollbar': { height: 6 },
        '&::-webkit-scrollbar-thumb': {
          background: `${BRAND.primary}55`,
          borderRadius: 3,
        },
      }}
    >
      {filters.map((f) => {
        const active = value === f.id;
        const count = counts[f.id] ?? 0;

        return (
          <Tooltip key={f.id} title={`${f.label} · ${count}`} arrow>
            <span>
              <Button
                onClick={() => onChange(f.id)}
                startIcon={isCompact ? undefined : f.icon}
                size="small"
                disabled={count === 0 && f.id !== 'all'}
                aria-label={f.label}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: 2,
                  minWidth: isCompact ? 44 : 'auto',
                  width: isCompact ? 44 : 'auto',
                  height: isCompact ? 40 : 'auto',
                  px: isCompact ? 0 : 1.5,
                  py: isCompact ? 0 : 0.6,
                  whiteSpace: 'nowrap',
                  border: '1px solid',
                  borderColor: active ? f.color : `${BRAND.light}`,
                  bgcolor: active ? f.color : '#fff',
                  color: active ? '#fff' : '#475569',
                  '& .MuiButton-startIcon': {
                    mr: 0.5,
                    '& > *:nth-of-type(1)': { fontSize: FILTER_ICON_SIZE },
                  },
                  '& > svg': {
                    fontSize: isCompact ? 22 : FILTER_ICON_SIZE,
                    color: active ? '#fff' : '#475569',
                  },
                  '&:hover': {
                    bgcolor: active ? f.color : `${f.color}15`,
                    borderColor: f.color,
                    color: active ? '#fff' : f.color,
                    '& > svg': { color: active ? '#fff' : f.color },
                  },
                  '&.Mui-disabled': {
                    opacity: 0.4,
                    bgcolor: '#fff',
                    color: '#94A3B8',
                    borderColor: BRAND.light,
                    '& > svg': { color: '#94A3B8' },
                  },
                }}
              >
                {isCompact ? (
                  f.icon
                ) : (
                  <>
                    {f.label}
                    {count > 0 && (
                      <Box
                        component="span"
                        sx={{
                          ml: 0.6,
                          px: 0.55,
                          py: 0.05,
                          borderRadius: 1,
                          fontSize: '0.62rem',
                          bgcolor: active
                            ? 'rgba(255,255,255,0.25)'
                            : `${f.color}22`,
                          color: active ? '#fff' : f.color,
                          fontWeight: 800,
                        }}
                      >
                        {count}
                      </Box>
                    )}
                  </>
                )}
              </Button>
            </span>
          </Tooltip>
        );
      })}
    </Box>
  );
}

/* ============================================================
   PHOTO SORT
   ============================================================ */

type PhotoSort = 'newest' | 'oldest';

function PhotoSortRow({
  value,
  onChange,
}: {
  value: PhotoSort;
  onChange: (next: PhotoSort) => void;
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1,
        mb: 4,
        justifyContent: { xs: 'center', md: 'center' },
      }}
    >
      <FormControl size="small" sx={{ minWidth: { xs: 160, md: 180 } }}>
        <InputLabel id="photo-sort-label" sx={{ fontSize: '0.8rem', fontWeight: 600 }}>
          <SortIcon sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
          Sort Photos
        </InputLabel>
        <Select
          labelId="photo-sort-label"
          value={value}
          label="Sort Photos"
          onChange={(e) => onChange(e.target.value as PhotoSort)}
          sx={{
            fontSize: '0.85rem',
            fontWeight: 600,
            borderRadius: 2,
            bgcolor: '#fff',
            '& .MuiSelect-select': { py: 0.9 },
          }}
        >
          <MenuItem value="newest" sx={{ fontSize: '0.85rem' }}>
            Newest first
          </MenuItem>
          <MenuItem value="oldest" sx={{ fontSize: '0.85rem' }}>
            Oldest first
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function MediaPage() {
  const { media, loading } = useMedia();
  const { content } = useContent('media');

  const [typeFilter, setTypeFilter] = useState<'image' | 'video'>('image');
  const [platformFilter, setPlatformFilter] = useState<VideoPlatformFilter>('all');
  const [photoSort, setPhotoSort] = useState<PhotoSort>('newest');

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
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
        iframe.contentWindow?.postMessage(
          JSON.stringify({ method: 'pause' }),
          '*'
        );
      } catch {
        /* ignore */
      }
    });
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
      if (m.type !== 'video') return;
      const p = detectPlatform(m.url);
      if (p === 'youtube') counts.youtube += 1;
      else if (p === 'instagram') counts.instagram += 1;
      else if (p === 'facebook') counts.facebook += 1;
      else if (p === 'twitter') counts.twitter += 1;
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

  const getTimestamp = (m: {
    createdAt?: string;
    date?: string;
    id?: string | number;
  }): number => {
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
      if (typeFilter !== 'video') return true;

      if (platformFilter === 'all') return true;
      const p = detectPlatform(m.url);

      if (platformFilter === 'youtube') return p === 'youtube';
      if (platformFilter === 'instagram') return p === 'instagram';
      if (platformFilter === 'facebook') return p === 'facebook';
      if (platformFilter === 'twitter') return p === 'twitter';
      return (
        p !== 'youtube' &&
        p !== 'instagram' &&
        p !== 'facebook' &&
        p !== 'twitter'
      );
    });

    if (typeFilter === 'image') {
      list = [...list].sort((a, b) => {
        const ta = getTimestamp(a);
        const tb = getTimestamp(b);
        return photoSort === 'newest' ? tb - ta : ta - tb;
      });
    }

    return list;
  })();

  /* ---------- LAYOUT MODE ---------- */
  const isTallMode = typeFilter === 'video' && platformFilter !== 'all';

  // Responsive preview height.
  // Mobile: preview shrinks to leave room for title + description + button
  //   so that ~1 full card fits on screen at a time.
  // Desktop: unchanged.
  const mediaHeightSx = isTallMode
    ? {
        xs: 260,                    // mobile: fits 1 full card (title+desc+preview+btn)
        sm: 300,
        md: MEDIA_HEIGHT_TALL,      // desktop: 480
      }
    : {
        xs: 180,                    // mobile: fits 1 full card
        sm: 200,
        md: MEDIA_HEIGHT_COMPACT,   // desktop: 220
      };

  const gridSize = isTallMode
    ? { xs: 12, sm: 6, md: 6, lg: 4 }
    : { xs: 12, sm: 6, md: 6, lg: 4 };

  const showPlatformFilter = typeFilter === 'video';

  return (
    <Box>
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(32,49,40,.94), rgba(85,122,70,.8)), url("${
            content['hero.image'] ||
            'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2000&q=85'
          }") center/cover`,
          color: 'white',
          py: { xs: 6, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, fontSize: { xs: '1.6rem', md: '3rem' }, mb: 2 }}
          >
            {content['hero.title'] || 'Our Gallery'}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 400, opacity: 0.9, fontSize: { xs: '0.9rem', md: '1.25rem' } }}
          >
            {content['hero.subtitle'] ||
              'Real projects, real installations — see our solar work across Maharashtra.'}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 4, md: 10 } }}>
        <SectionTitle
          eyebrow={content['gallery.eyebrow'] || 'Media'}
          title={content['gallery.title'] || 'Installation Photos & Videos'}
          subtitle={
            content['gallery.subtitle'] ||
            'A visual showcase of our completed solar projects.'
          }
        />

        {/* TABS */}
        <Stack sx={{ mb: { xs: 2, md: 3 }, alignItems: 'center' }}>
          <Tabs
            value={typeFilter}
            onChange={(_, v) => setTypeFilter(v as 'image' | 'video')}
            variant="scrollable"
            allowScrollButtonsMobile
            sx={{
              bgcolor: BRAND.light,
              borderRadius: 3,
              p: 0.5,
              minHeight: 'auto',
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                minHeight: 40,
                borderRadius: 2.5,
                mx: 0.5,
                color: 'text.secondary',
                fontWeight: 600,
                fontSize: { xs: '0.8rem', md: '0.875rem' },
                '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white' },
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
              icon={<VideoLibrary sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="Videos"
              value="video"
            />
          </Tabs>
        </Stack>

        {/* PLATFORM FILTER */}
        {showPlatformFilter && platformCounts.all > 0 && (
          <PlatformFilterRow
            value={platformFilter}
            onChange={setPlatformFilter}
            counts={platformCounts}
          />
        )}

        {/* PHOTO SORT */}
        {typeFilter === 'image' && (
          <PhotoSortRow value={photoSort} onChange={setPhotoSort} />
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: BRAND.primary }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              No {typeFilter === 'image' ? 'photos' : 'videos'} yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, md: 3 }} sx={{ alignItems: 'stretch' }}>
            <AnimatePresence mode="popLayout">
              {filtered.map((m, i) => {
                const platform = detectPlatform(m.url);
                const meta = getPlatformMeta(platform);
                const isFileVideo = m.type === 'video' && platform === 'file';
                const isYtVimeo =
                  m.type === 'video' &&
                  (platform === 'youtube' || platform === 'vimeo');
                const isSocial =
                  m.type === 'video' &&
                  (platform === 'instagram' || platform === 'tiktok');
                const isTwitter = m.type === 'video' && platform === 'twitter';
                const isFacebook = m.type === 'video' && platform === 'facebook';
                const isUnknown = m.type === 'video' && platform === 'unknown';

                return (
                  <Grid size={gridSize} key={m.id} sx={{ display: 'flex' }}>
                    <Card
                      component={motion.div}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                      sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${BRAND.light}`,
                        transition: 'all 0.3s',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: SHADOW.cardHover,
                        },
                      }}
                    >
                      {/* ============ TITLE + DESCRIPTION (ABOVE PREVIEW) ============ */}
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
                            fontSize: { xs: '0.9rem', md: '1rem' },
                            lineHeight: 1.3,
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: m.description ? 0.5 : 0,
                          }}
                        >
                          {m.title}
                        </Typography>
                        {m.description && (
                          <Typography
                            variant="body2"
                            sx={{
                              fontSize: { xs: '0.72rem', md: '0.78rem' },
                              color: 'text.secondary',
                              lineHeight: 1.4,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {m.description}
                          </Typography>
                        )}
                      </Box>

                      {/* ============ PREVIEW BOX (CONTENT ONLY) ============ */}
                      <Box
                        sx={{
                          height: mediaHeightSx,
                          maxHeight: mediaHeightSx,
                          minHeight: mediaHeightSx,
                          flexShrink: 0,
                          bgcolor: '#000',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'height 0.35s ease',
                        }}
                      >
                        {/* PHOTO */}
                        {m.type === 'image' && (
                          <CardMedia
                            component="img"
                            image={m.url}
                            alt={m.title}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        )}

                        {/* FILE VIDEO */}
                        {isFileVideo && (
                          <DirectVideo
                            url={m.url}
                            registerVideo={registerVideo}
                            onPlay={pauseAllOthers}
                          />
                        )}

                        {/* YOUTUBE / VIMEO */}
                        {isYtVimeo && (
                          <ExternalEmbed
                            url={m.url}
                            platform={platform as 'youtube' | 'vimeo'}
                            title={m.title}
                            registerPlayer={registerIframe}
                          />
                        )}

                        {/* INSTAGRAM / TIKTOK */}
                        {isSocial && (
                          <CleanSocialEmbed
                            url={m.url}
                            platform={platform as 'instagram' | 'tiktok'}
                            registerPlayer={registerIframe}
                          />
                        )}

                        {/* TWITTER / X / FACEBOOK / UNKNOWN */}
                        {(isTwitter || isFacebook || isUnknown) && (
                          <FallbackPreview url={m.url} />
                        )}
                      </Box>

                      {/* ============ WATCH ON ... BUTTON (BELOW PREVIEW) ============ */}
                      {m.type === 'video' && (
                        <Box
                          sx={{
                            px: { xs: 1.25, md: 1.5 },
                            py: { xs: 1, md: 1.25 },
                          }}
                        >
                          <Button
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            fullWidth
                            size="small"
                            startIcon={meta.icon}
                            endIcon={<OpenIcon sx={{ fontSize: 14 }} />}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700,
                              fontSize: { xs: '0.75rem', md: '0.8rem' },
                              py: { xs: 0.6, md: 0.7 },
                              borderRadius: 1.5,
                              bgcolor: meta.color,
                              color: '#fff',
                              boxShadow: 'none',
                              '& .MuiButton-startIcon': {
                                mr: 0.5,
                                '& > *:nth-of-type(1)': { fontSize: 16 },
                              },
                              '& .MuiButton-endIcon': {
                                ml: 0.5,
                              },
                              '&:hover': {
                                bgcolor: meta.color,
                                filter: 'brightness(0.9)',
                                boxShadow: `0 6px 16px ${meta.color}55`,
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