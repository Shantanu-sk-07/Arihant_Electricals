import { useState } from 'react';
import { Box, Fab, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import { WhatsApp as WhatsAppIcon, Person as PersonIcon } from '@mui/icons-material';
import { useSettings } from '../hooks/useSettings';
import { BRAND } from '@/constants/Brand';

export default function WhatsAppButton() {
  const { settings } = useSettings();
  const [open, setOpen] = useState(false);

  const hasTwo = Boolean(settings.whatsapp_1 && settings.whatsapp_2);

  const actions = [
    {
      icon: <WhatsAppIcon />,
      name: settings.whatsapp_1_name || 'Suraj',
      phone: settings.whatsapp_1 || '917774855501',
    },
    ...(hasTwo
      ? [{
          icon: <WhatsAppIcon />,
          name: settings.whatsapp_2_name || 'Neeraj',
          phone: settings.whatsapp_2 || '919767334454',
        }]
      : []),
  ];

  if (!hasTwo) {
    return (
      <Fab
        href={`https://wa.me/${actions[0].phone}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        sx={{
          position: 'fixed',
          bottom: { xs: 20, md: 28 },
          right: { xs: 20, md: 28 },
          bgcolor: BRAND.success,
          color: 'white',
          zIndex: 1200,
          width: { xs: 56, md: 64 },
          height: { xs: 56, md: 64 },
          boxShadow: `0 12px 32px ${BRAND.success}60`,
          '&:hover': { bgcolor: '#128C4A', transform: 'scale(1.05)' },
          transition: 'all 0.2s',
        }}
      >
        <WhatsAppIcon sx={{ fontSize: { xs: 28, md: 34 } }} />
      </Fab>
    );
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: { xs: 20, md: 28 },
        right: { xs: 20, md: 28 },
        zIndex: 1200,
      }}
    >
      <SpeedDial
        ariaLabel="WhatsApp contacts"
        icon={<SpeedDialIcon icon={<WhatsAppIcon />} openIcon={<PersonIcon />} />}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        FabProps={{
          sx: {
            bgcolor: BRAND.success,
            color: 'white',
            width: { xs: 56, md: 64 },
            height: { xs: 56, md: 64 },
            boxShadow: `0 12px 32px ${BRAND.success}60`,
            '&:hover': { bgcolor: '#128C4A' },
          },
        }}
        direction="up"
      >
        {actions.map((a) => (
          <SpeedDialAction
            key={a.name}
            icon={a.icon}
            slotProps={{ tooltip: { title: a.name } }}
            onClick={() => window.open(`https://wa.me/${a.phone}`, '_blank', 'noopener,noreferrer')}
            sx={{
              '& .MuiSpeedDialAction-fab': {
                bgcolor: BRAND.success,
                color: 'white',
                '&:hover': { bgcolor: '#128C4A' },
              },
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}