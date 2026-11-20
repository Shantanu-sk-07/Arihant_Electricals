import { useState, type ReactElement } from "react";
import { Link as RouterLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import ArticleIcon from "@mui/icons-material/Article";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LogoutIcon from "@mui/icons-material/Logout";
import { SITE_INFO } from "../config/SiteInfo";
// NOTE: adjust this path to wherever SolarTheme.tsx lives in your project.
import { FONT, INK, LINE, MUTED, NAVY, NAVY_DEEP, SOFT, YELLOW } from "../pages/SolarTheme";

const SIDEBAR_WIDTH = 260;

interface NavItem {
  label: string;
  to: string;
  icon: ReactElement;
}

/** Add more admin pages here as you build them (e.g. Leads, Media). */
const NAV_ITEMS: NavItem[] = [
  { label: "Website Content", to: "/admin/content", icon: <ArticleIcon /> },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();

  const current =
    NAV_ITEMS.find((n) => location.pathname.startsWith(n.to))?.label ??
    "Dashboard";

  const handleLogout = (): void => {
    // TODO: clear your stored admin token/session here before redirecting.
    navigate("/admin/login", { replace: true });
  };

  const sidebar = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: NAVY,
        color: "#FFFFFF",
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", px: 2.5, py: 3 }}>
        <Box
          sx={{
            width: 42,
            height: 42,
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
        <Box>
          <Typography sx={{ fontWeight: 800, lineHeight: 1.1 }}>{SITE_INFO.name}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Admin Dashboard
          </Typography>
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <List sx={{ px: 1.5, py: 2, flexGrow: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.to);
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={RouterLink}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                selected={active}
                sx={{
                  borderRadius: "10px",
                  color: "rgba(255,255,255,0.85)",
                  "& .MuiListItemIcon-root": { color: active ? YELLOW : "rgba(255,255,255,0.7)", minWidth: 40 },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.12)",
                    color: "#FFFFFF",
                    borderLeft: `4px solid ${YELLOW}`,
                  },
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.08)" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.label}
                  slotProps={{ primary: { sx: { fontWeight: active ? 800 : 600 } } }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          component={RouterLink}
          to="/"
          target="_blank"
          fullWidth
          startIcon={<OpenInNewIcon />}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: "10px",
            py: 1,
            "&:hover": { borderColor: YELLOW, color: YELLOW },
          }}
        >
          View Website
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily: FONT, backgroundColor: SOFT, color: INK }}>
      {isDesktop ? (
        <Drawer
          variant="permanent"
          sx={{
            width: SIDEBAR_WIDTH,
            flexShrink: 0,
            "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, boxSizing: "border-box", border: 0 },
          }}
          open
        >
          {sidebar}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: SIDEBAR_WIDTH, border: 0 } }}
        >
          {sidebar}
        </Drawer>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{ backgroundColor: "#FFFFFF", color: INK, borderBottom: `1px solid ${LINE}` }}
        >
          <Toolbar sx={{ minHeight: { xs: 64, md: 72 }, gap: 1 }}>
            {!isDesktop && (
              <IconButton edge="start" aria-label="open menu" onClick={() => setMobileOpen(true)} sx={{ color: NAVY }}>
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ flexGrow: 1 }}>
              <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: "1.25rem", lineHeight: 1.15 }}>
                {current}
              </Typography>
              <Typography variant="caption" sx={{ color: MUTED }}>
                Manage what visitors see on your website
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: NAVY_DEEP, color: YELLOW, width: 36, height: 36, fontWeight: 800 }}>
              A
            </Avatar>
            <Button
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{ textTransform: "none", fontWeight: 700, color: NAVY, display: { xs: "none", sm: "inline-flex" } }}
            >
              Logout
            </Button>
            <IconButton
              aria-label="logout"
              onClick={handleLogout}
              sx={{ color: NAVY, display: { xs: "inline-flex", sm: "none" } }}
            >
              <LogoutIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}