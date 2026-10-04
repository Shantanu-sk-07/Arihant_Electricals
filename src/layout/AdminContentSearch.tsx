import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Box,
  CircularProgress,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  ArrowForward,
  Home as HomeIcon,
  MiscellaneousServices as ServicesIcon,
  Payments as PricingIcon,
  PhotoLibrary as MediaIcon,
  Star as BenefitsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type SearchRow = Record<string, unknown>;
type SearchSource = {
  table: string;
  label: string;
  route: string;
  rows: SearchRow[];
};
type SearchHit = {
  route: string;
  subPage?: string;
  label: string;
  preview: string;
};
type SearchGroup = {
  route: string;
  subPage?: string;
  label: string;
  count: number;
  previews: string[];
};

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  about: 'About',
  contact: 'Contact',
};

const ROUTE_ICONS = {
  '/admin/basic': <HomeIcon fontSize="small" />,
  '/admin/services': <ServicesIcon fontSize="small" />,
  '/admin/pricing': <PricingIcon fontSize="small" />,
  '/admin/media': <MediaIcon fontSize="small" />,
  '/admin/benefits': <BenefitsIcon fontSize="small" />,
  '/admin/extra': <HomeIcon fontSize="small" />,
};

async function fetchSearchIndex(): Promise<SearchSource[]> {
  const sources = [
    {
      table: 'site_settings',
      label: 'Basic Details',
      route: '/admin/basic',
      query: supabase.from('site_settings').select('key,value'),
    },
    {
      table: 'site_content',
      label: 'Page content',
      route: '/admin/extra',
      query: supabase.from('site_content').select('page,section,key,value'),
    },
    {
      table: 'services',
      label: 'Services',
      route: '/admin/services',
      query: supabase
        .from('services')
        .select('title,short_description,full_description,icon,image_url,features'),
    },
    {
      table: 'pricing_plans',
      label: 'Pricing',
      route: '/admin/pricing',
      query: supabase
        .from('pricing_plans')
        .select('kw,system_type,total_cost,subsidy_amount,final_cost,monthly_savings,panels_count,area_required'),
    },
    {
      table: 'media',
      label: 'Media',
      route: '/admin/media',
      query: supabase.from('media').select('title,description,type,url'),
    },
    {
      table: 'solar_benefits',
      label: 'Benefits & Testimonials',
      route: '/admin/benefits',
      query: supabase.from('solar_benefits').select('title,description,icon,stat_value,stat_label'),
    },
    {
      table: 'testimonials',
      label: 'Benefits & Testimonials',
      route: '/admin/benefits',
      query: supabase.from('testimonials').select('name,location,message'),
    },
  ];

  return Promise.all(
    sources.map(async ({ table, label, route, query }) => {
      const { data, error } = await query;
      if (error) throw new Error(`Unable to search ${table}: ${error.message}`);
      return { table, label, route, rows: (data ?? []) as SearchRow[] };
    }),
  );
}

function getDestination(source: SearchSource, row: SearchRow) {
  if (source.table !== 'site_content') return { route: source.route };
  const page = typeof row.page === 'string' ? row.page : '';
  if (page === 'services') return { route: '/admin/services' };
  if (page === 'pricing') return { route: '/admin/pricing' };
  if (page === 'media') return { route: '/admin/media' };
  if (page in PAGE_LABELS) return { route: '/admin/extra', subPage: page };
  return { route: source.route };
}

function searchableFields(row: SearchRow) {
  return Object.entries(row).filter(([key, value]) => {
    if (['id', 'created_at', 'updated_at', 'sort_order', 'is_active', 'is_read'].includes(key)) {
      return false;
    }
    return typeof value === 'string' || typeof value === 'number' || Array.isArray(value);
  });
}

function getRowLabel(source: SearchSource, row: SearchRow) {
  if (source.table === 'site_content') {
    return [row.page, row.section, row.key].filter(Boolean).join(' · ');
  }
  return String(row.title ?? row.name ?? row.key ?? source.label);
}

function buildGroups(sources: SearchSource[], term: string): SearchGroup[] {
  const needle = term.trim().toLocaleLowerCase();
  if (!needle) return [];

  const hits: SearchHit[] = [];
  for (const source of sources) {
    for (const row of source.rows) {
      const matchingFields = searchableFields(row).filter(([, value]) =>
        String(Array.isArray(value) ? value.join(' ') : value)
          .toLocaleLowerCase()
          .includes(needle),
      );
      if (matchingFields.length === 0) continue;

      const destination = getDestination(source, row);
      const preview = matchingFields
        .slice(0, 2)
        .map(([key, value]) => {
          const text = String(Array.isArray(value) ? value.join(', ') : value);
          return `${key.replace(/_/g, ' ')}: ${text.slice(0, 90)}`;
        })
        .join(' · ');
      hits.push({
        ...destination,
        label: getRowLabel(source, row),
        preview,
      });
    }
  }

  const groups = new Map<string, SearchGroup>();
  for (const hit of hits) {
    const id = `${hit.route}:${hit.subPage ?? ''}`;
    const group = groups.get(id);
    if (group) {
      group.count += 1;
      if (group.previews.length < 2) group.previews.push(`${hit.label} — ${hit.preview}`);
      continue;
    }
    const baseLabel = hit.route === '/admin/extra' && hit.subPage
      ? `${PAGE_LABELS[hit.subPage]} · Extra Details`
      : hit.route === '/admin/benefits'
        ? 'Benefits & Testimonials'
        : hit.route === '/admin/basic'
          ? (hit.label.startsWith('Basic Details ·') ? hit.label : 'Basic Details')
          : hit.route === '/admin/services'
            ? 'Services'
            : hit.route === '/admin/pricing'
              ? 'Pricing'
              : hit.route === '/admin/media'
                ? 'Media'
                : hit.label;
    groups.set(id, {
      route: hit.route,
      subPage: hit.subPage,
      label: baseLabel,
      count: 1,
      previews: [`${hit.label} — ${hit.preview}`],
    });
  }
  return [...groups.values()];
}

export default function AdminContentSearch() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [term, setTerm] = useState('');
  const [focused, setFocused] = useState(false);
  const autoOpenedTerm = useRef('');
  const { data, error, isFetching } = useQuery({
    queryKey: ['admin-content-search-index'],
    queryFn: fetchSearchIndex,
    enabled: term.trim().length >= 2,
    staleTime: 30_000,
    retry: false,
  });
  const groups = useMemo(() => buildGroups(data ?? [], term), [data, term]);

  useEffect(() => {
    const timeout = window.setTimeout(() => setTerm(value), 500);
    return () => window.clearTimeout(timeout);
  }, [value]);

  useEffect(() => {
    if (!focused || term.trim().length < 2 || isFetching || error || groups.length !== 1) return;
    if (autoOpenedTerm.current === term) return;
    const [match] = groups;
    autoOpenedTerm.current = term;
    navigate(match.route, {
      state: match.subPage ? { adminSearchPage: match.subPage } : undefined,
    });
    window.setTimeout(() => {
      setValue('');
      setTerm('');
      setFocused(false);
    }, 0);
  }, [error, focused, groups, isFetching, navigate, term]);

  const openMatch = (match: SearchGroup) => {
    navigate(match.route, {
      state: match.subPage ? { adminSearchPage: match.subPage } : undefined,
    });
    setValue('');
    setTerm('');
    setFocused(false);
  };

  const showResults = focused && term.trim().length >= 2;

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 560 }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(event) => {
          autoOpenedTerm.current = '';
          setValue(event.target.value);
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search website content to manage…"
        slotProps={{
          htmlInput: { 'aria-label': 'Search content across admin tabs' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: isFetching ? (
              <InputAdornment position="end">
                <CircularProgress size={18} />
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'background.default',
            borderRadius: 3,
          },
        }}
      />
      {showResults && (
        <Paper
          elevation={8}
          sx={{
            position: 'absolute',
            zIndex: (theme) => theme.zIndex.modal,
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            maxHeight: 360,
            overflowY: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          {error ? (
            <Alert severity="error" sx={{ m: 1 }}>
              {error instanceof Error ? error.message : 'Unable to search website content.'}
            </Alert>
          ) : isFetching ? (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>Searching saved content…</Typography>
          ) : groups.length === 0 ? (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>
              No saved content matches this search. It may be hardcoded or not saved yet.
            </Typography>
          ) : groups.length === 1 ? (
            <Typography sx={{ p: 2, color: 'text.secondary' }}>Opening the matching tab…</Typography>
          ) : (
            <List disablePadding>
              {groups.map((group) => (
                <ListItemButton
                  key={`${group.route}:${group.subPage ?? ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => openMatch(group)}
                  sx={{ alignItems: 'flex-start', gap: 1.5, py: 1.25 }}
                >
                  <Box sx={{ color: 'primary.main', mt: 0.5 }}>
                    {ROUTE_ICONS[group.route as keyof typeof ROUTE_ICONS]}
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 700 }}>
                          {group.label}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary">
                          {group.count} match{group.count === 1 ? '' : 'es'}
                        </Typography>
                      </Box>
                    }
                    secondary={group.previews.map((preview) => (
                      <Typography
                        key={preview}
                        component="span"
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: 'block', mt: 0.25, overflowWrap: 'anywhere' }}
                      >
                        {preview}
                      </Typography>
                    ))}
                  />
                  <ArrowForward fontSize="small" sx={{ color: 'text.secondary', mt: 0.5 }} />
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      )}
    </Box>
  );
}
