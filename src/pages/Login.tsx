import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import SolarPowerIcon from "@mui/icons-material/SolarPower";
import { adminLogin } from "../config/Services";
import { SITE_INFO } from "../config/SiteInfo";
import { FONT, IMG, INK, LINE, MUTED, NAVY, YELLOW, BLUE, btn, navyOverlay } from "./SolarTheme";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    setError("");
    if (!username.trim() || !password) {
      setError("Enter username and password");
      return;
    }
    setLoading(true);
    try {
      await adminLogin({ username: username.trim(), password });
      navigate("/admin/content", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": { borderColor: LINE },
      "&:hover fieldset": { borderColor: BLUE },
      "&.Mui-focused fieldset": { borderColor: NAVY },
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: navyOverlay(IMG.heroRooftop, 0.82),
        backgroundSize: "cover",
        backgroundPosition: "center",
        p: 2,
        fontFamily: FONT,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "22px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 3 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: NAVY,
                color: YELLOW,
              }}
            >
              <SolarPowerIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: "1.5rem", color: NAVY }}>
              {SITE_INFO.name}
            </Typography>
            <Typography variant="body2" sx={{ color: MUTED }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, color: INK }}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              sx={fieldSx}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              sx={fieldSx}
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              fullWidth
              size="large"
              variant="contained"
              onClick={() => void handleSubmit()}
              disabled={loading}
              sx={{ ...btn("yellow"), py: 1.6 }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: NAVY }} /> : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}