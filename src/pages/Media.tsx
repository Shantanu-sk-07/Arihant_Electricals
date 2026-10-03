import {
  Box, Container, Grid, Typography, Card, CardMedia, CardContent,
  Chip, Stack, Tabs, Tab, CircularProgress,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Image as ImageIcon, VideoLibrary } from '@mui/icons-material';
import { useMedia } from '../hooks/useMedia';
import SectionTitle from '../components/SectionTitle';
import { BRAND, SHADOW } from '@/constants/Brand';
import { useContent } from '@/hooks/useContent';

/**
 * Converts any common YouTube URL into an embed URL.
 * Safe to call on already-embed URLs.
 */
function toYouTubeEmbed(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();

  // Already an embed URL
  if (/youtube\.com\/embed\/[A-Za-z0-9_-]{11}/.test(trimmed)) return trimmed;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*v=)([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /[?&]v=([A-Za-z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match) return `https://www.youtube.com/embed/${match[1]}`;
  }

  return trimmed;
}

export default function MediaPage() {
  const { media, loading } = useMedia();
  const { content } = useContent('media');
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  const filtered = media.filter((m) => filter === 'all' || m.type === filter);

  return (
    <Box>
      <Box
        sx={{
          background: `linear-gradient(135deg, rgba(32,49,40,.94), rgba(85,122,70,.8)), url("${content['hero.image'] || 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=2000&q=85'}") center/cover`,
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}
          >
            {content['hero.title'] || 'Our Gallery'}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
            {content['hero.subtitle'] ||
              'Real projects, real installations — see our solar work across Maharashtra.'}
          </Typography>
        </Container>
      </Box>

      <Container sx={{ py: { xs: 6, md: 10 } }}>
        <SectionTitle
          eyebrow={content['gallery.eyebrow'] || 'Media'}
          title={content['gallery.title'] || 'Installation Photos & Videos'}
          subtitle={
            content['gallery.subtitle'] ||
            'A visual showcase of our completed solar projects.'
          }
        />

        <Stack sx={{ mb: 4, alignItems: 'center' }}>
          <Tabs
            value={filter}
            onChange={(_, v) => setFilter(v as 'all' | 'image' | 'video')}
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
                fontSize: '0.875rem',
                '&.Mui-selected': { bgcolor: BRAND.primary, color: 'white' },
              },
            }}
          >
            <Tab
              icon={<ImageIcon sx={{ fontSize: 18 }} />}
              iconPosition="start"
              label="All"
              value="all"
            />
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

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: BRAND.primary }} />
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: 'text.secondary' }}>
              No{' '}
              {filter === 'all' ? 'media' : filter === 'image' ? 'photos' : 'videos'}{' '}
              yet.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            <AnimatePresence mode="popLayout">
              {filtered.map((m, i) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={m.id}>
                  <Card
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    sx={{
                      height: '100%',
                      border: `1px solid ${BRAND.light}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: SHADOW.cardHover,
                      },
                    }}
                  >
                    {m.type === 'image' ? (
                      <CardMedia
                        component="img"
                        height="220"
                        image={m.url}
                        alt={m.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '56.25%',
                          bgcolor: '#000',
                        }}
                      >
                        <iframe
                          src={toYouTubeEmbed(m.url)}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            border: 0,
                          }}
                          allowFullScreen
                          title={m.title}
                        />
                      </Box>
                    )}
                    <CardContent>
                      <Chip
                        size="small"
                        label={m.type === 'image' ? 'Photo' : 'Video'}
                        sx={{
                          mb: 1,
                          bgcolor:
                            m.type === 'image'
                              ? `${BRAND.primary}15`
                              : `${BRAND.secondary}15`,
                          color:
                            m.type === 'image'
                              ? BRAND.primary
                              : BRAND.secondary,
                          fontWeight: 700,
                          fontSize: '0.7rem',
                        }}
                      />
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: 'text.primary',
                          mb: 0.5,
                        }}
                      >
                        {m.title}
                      </Typography>
                      {m.description && (
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary', lineHeight: 1.6 }}
                        >
                          {m.description}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
        )}
      </Container>
    </Box>
  );
}