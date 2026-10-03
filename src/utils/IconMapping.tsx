/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { MenuItem, TextField } from '@mui/material';
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
  return (
    <TextField
      select
      fullWidth={fullWidth}
      label={label}
      value={ICON_MAPPING.some((option) => option.value === value) ? value : 'solar_power'}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        select: {
          renderValue: (selected: unknown) => (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {getMappedIcon(String(selected))}
            {ICON_MAPPING.find((option) => option.value === String(selected))?.label ?? 'Solar power'}
          </span>
          ),
        },
      }}
    >
      {ICON_MAPPING.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {option.icon}
            {option.label}
          </span>
        </MenuItem>
      ))}
    </TextField>
  );
}
