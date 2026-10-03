import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  children?: ReactNode;
}

export default function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  children,
}: Props) {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
      sx={{
        textAlign: align,
        mb: { xs: 4, md: 6 },
        maxWidth: align === 'center' ? 720 : 'none',
        mx: align === 'center' ? 'auto' : 0,
      }}
    >
      {eyebrow && (
        <Typography
          variant="overline"
          sx={{
            color: 'primary.main',
            fontWeight: 700,
            letterSpacing: '0.12em',
            display: 'block',
            mb: 1,
            fontSize: '0.8rem',
          }}
        >
          {eyebrow}
        </Typography>
      )}
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
          color: 'text.primary',
          mb: subtitle ? 1.5 : 0,
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            fontSize: { xs: '0.95rem', md: '1.05rem' },
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
}