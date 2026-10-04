/* eslint-disable react-refresh/only-export-components */
import { useState, type ReactNode } from 'react';
import {
  Box,
  Button,
  Popover,
  TextField,
  Tooltip,
  Typography,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  AccountBalance,
  Bolt,
  CheckCircle,
  Description,
  ElectricBolt,
  EnergySavingsLeaf,
  Engineering,
  Factory,
  Home,
  Inventory2,
  Lightbulb,
  LocalFlorist,
  Park,
  Savings,
  Schedule,
  Shield,
  SolarPower,
  Star,
  SupportAgent,
  WbSunny,
} from '@mui/icons-material';
import {
  IconBatteryCharging,
  IconBuildingStore,
  IconLeaf,
  IconPlant2,
  IconSun,
  IconTools,
} from '@tabler/icons-react';
import { BRAND } from '@/constants/Brand';

export interface IconOption {
  value: string;
  label: string;
  icon: ReactNode;
}

export const ICON_MAPPING: readonly IconOption[] = [
  { value: 'solar_power', label: 'Solar power', icon: <SolarPower /> },
  { value: 'sun', label: 'Sun', icon: <WbSunny /> },
  { value: 'savings', label: 'Savings', icon: <Savings /> },
  { value: 'account_balance', label: 'Government', icon: <AccountBalance /> },
  { value: 'schedule', label: 'Time', icon: <Schedule /> },
  { value: 'eco', label: 'Eco', icon: <EnergySavingsLeaf /> },
  { value: 'description', label: 'Documents', icon: <Description /> },
  { value: 'inventory_2', label: 'Materials', icon: <Inventory2 /> },
  { value: 'bolt', label: 'Power', icon: <Bolt /> },
  { value: 'electric_bolt', label: 'Electricity', icon: <ElectricBolt /> },
  { value: 'home', label: 'Home', icon: <Home /> },
  { value: 'battery', label: 'Battery storage', icon: <IconBatteryCharging /> },
  { value: 'building_solar', label: 'Solar building', icon: <IconBuildingStore /> },
  { value: 'leaf', label: 'Leaf', icon: <IconLeaf /> },
  { value: 'plant', label: 'Plant', icon: <IconPlant2 /> },
  { value: 'sun_tabler', label: 'Sunshine', icon: <IconSun /> },
  { value: 'tools', label: 'Tools', icon: <IconTools /> },
  { value: 'shield', label: 'Protection', icon: <Shield /> },
  { value: 'engineering', label: 'Engineering', icon: <Engineering /> },
  { value: 'support', label: 'Support', icon: <SupportAgent /> },
  { value: 'factory', label: 'Industry', icon: <Factory /> },
  { value: 'star', label: 'Star', icon: <Star /> },
  { value: 'check_circle', label: 'Verified', icon: <CheckCircle /> },
  { value: 'lightbulb', label: 'Ideas', icon: <Lightbulb /> },
  { value: 'flower', label: 'Nature', icon: <LocalFlorist /> },
  { value: 'park', label: 'Environment', icon: <Park /> },
] as const;

export function getMappedIcon(name: string | null | undefined): ReactNode {
  return ICON_MAPPING.find((option) => option.value === name)?.icon ?? <SolarPower />;
}

/* ---------------- ICON GRID (used inside the popover) ---------------- */

interface IconGridProps {
  value: string;
  onSelect: (value: string) => void;
}

function IconGrid({ value, onSelect }: IconGridProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(3, 1fr)',
          sm: 'repeat(5, 1fr)',
          md: 'repeat(6, 1fr)',
        },
        gap: 1.25,
        p: 0.5,
      }}
    >
      {ICON_MAPPING.map((option) => {
        const active = option.value === value;
        return (
          <Tooltip key={option.value} title={option.label} arrow placement="top">
            <Box
              component="button"
              type="button"
              onClick={() => onSelect(option.value)}
              sx={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
                aspectRatio: '1 / 1',
                p: 1,
                borderRadius: 2,
                border: `1.5px solid ${active ? BRAND.primary : BRAND.light}`,
                bgcolor: active ? `${BRAND.primary}12` : 'background.paper',
                color: active ? BRAND.primary : 'text.secondary',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: BRAND.primary,
                  bgcolor: `${BRAND.primary}08`,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(85,122,70,0.15)',
                },
                '& svg': {
                  fontSize: 26,
                  color: 'inherit',
                },
                '&:focus-visible': {
                  outline: `2px solid ${BRAND.primary}`,
                  outlineOffset: 2,
                },
              }}
            >
              {option.icon}
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  fontWeight: active ? 700 : 500,
                  textAlign: 'center',
                  lineHeight: 1.1,
                  color: 'inherit',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  maxWidth: '100%',
                }}
              >
                {option.label}
              </Typography>
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
}

/* ---------------- ICON PICKER ---------------- */

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
}

export function IconPicker({
  value,
  onChange,
  label = 'Choose icon',
  fullWidth = true,
}: IconPickerProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const current = ICON_MAPPING.find((o) => o.value === value) ?? ICON_MAPPING[0];

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (v: string) => {
    onChange(v);
    handleClose();
  };

  return (
    <>
      <TextField
        fullWidth={fullWidth}
        label={label}
        value={current.label}
        onClick={handleOpen}
        slotProps={{
          input: {
            readOnly: true,
            startAdornment: (
              <Box
                sx={{
                  mr: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: BRAND.primary,
                  '& svg': { fontSize: 22 },
                }}
              >
                {current.icon}
              </Box>
            ),
            endAdornment: (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                  whiteSpace: 'nowrap',
                }}
              >
                Click to change
              </Typography>
            ),
          },
        }}
        sx={{
          '& .MuiInputBase-root': {
            cursor: 'pointer',
            bgcolor: '#fff',
          },
          '& .MuiInputBase-input': {
            cursor: 'pointer',
          },
        }}
      />

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              width: {
                xs: 'calc(100vw - 32px)',
                sm: 460,
                md: 540,
              },
              maxWidth: '95vw',
              borderRadius: 3,
              boxShadow: '0 16px 40px rgba(0,0,0,0.16)',
              overflow: 'hidden',
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.5,
            borderBottom: `1px solid ${BRAND.light}`,
            bgcolor: 'background.paper',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: 'text.primary' }}>
            Pick an icon
          </Typography>
          <IconButton size="small" onClick={handleClose} aria-label="Close icon picker">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable grid */}
        <Box
          sx={{
            maxHeight: 340,
            overflowY: 'auto',
            p: 1.5,
            '&::-webkit-scrollbar': { width: 6 },
            '&::-webkit-scrollbar-track': { bgcolor: 'transparent' },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: `${BRAND.primary}55`,
              borderRadius: 3,
              '&:hover': { bgcolor: `${BRAND.primary}88` },
            },
          }}
        >
          <IconGrid value={value} onSelect={handleSelect} />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 2,
            py: 1.25,
            borderTop: `1px solid ${BRAND.light}`,
            bgcolor: 'background.paper',
          }}
        >
          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
            {ICON_MAPPING.length} icons
          </Typography>
          <Button
            size="small"
            onClick={handleClose}
            sx={{ textTransform: 'none', color: BRAND.primary, fontWeight: 600 }}
          >
            Done
          </Button>
        </Box>
      </Popover>
    </>
  );
}