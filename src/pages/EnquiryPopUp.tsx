import { useEffect, useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  BLUE,
  HEADING_FONT,
  MUTED,
  NAVY,
  SERVICE_DISTRICTS,
  btn,
} from "../pages/SolarTheme";

const SEEN_KEY = "arihant-enquiry-seen";
const SHOW_DELAY_MS = 2500;

export default function EnquiryPopup() {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [district, setDistrict] = useState<string>(SERVICE_DISTRICTS[0]);
  const [busy, setBusy] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {
      // Storage is blocked: show the popup anyway.
    }
    const timer = window.setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const close = (): void => {
    setOpen(false);
    try {
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {
      // Ignore: the popup may reappear on the next visit.
    }
  };

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (digits.length !== 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { submitLead } = await import("../config/Services");
      await submitLead({
        name: name.trim(),
        phone: digits,
        pincode: "000000",
        monthlyBill: 0,
        message: `Website popup enquiry · District: ${district}`,
      });
      setDone(true);
      window.setTimeout(close, 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="xs"
      fullWidth
      aria-labelledby="enquiry-title"
      sx={{ "& .MuiDialog-paper": { borderRadius: "22px" } }}
    >
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, position: "relative" }}>
        <IconButton
          aria-label="Close enquiry"
          onClick={close}
          sx={{ position: "absolute", top: 12, right: 12, color: MUTED }}
        >
          <CloseIcon />
        </IconButton>

        {done ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              alignItems: "center",
              textAlign: "center",
              py: 3,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 56, color: BLUE }} />
            <Typography sx={{ fontFamily: HEADING_FONT, fontWeight: 800, color: NAVY, fontSize: "1.4rem" }}>
              Thank you
            </Typography>
            <Typography sx={{ color: MUTED }}>
              Our solar team will call you within 24 hours.
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={submit} noValidate>
            <Typography
              id="enquiry-title"
              sx={{ fontFamily: HEADING_FONT, fontWeight: 800, color: NAVY, fontSize: "1.6rem", pr: 4, lineHeight: 1.2 }}
            >
              Get a free solar estimate
            </Typography>
            <Typography sx={{ color: MUTED, mt: 1, mb: 3 }}>
              Share your details and our team will call you back.
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                fullWidth
              />
              <TextField
                label="Mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 10 } }}
                fullWidth
              />
              <TextField
                select
                label="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                fullWidth
              >
                {SERVICE_DISTRICTS.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
                <MenuItem value="Other South Maharashtra">Other South Maharashtra</MenuItem>
              </TextField>
              {error && <Alert severity="error">{error}</Alert>}
              <Button
                type="submit"
                size="large"
                disabled={busy}
                sx={{ ...btn("yellow"), py: 1.5 }}
              >
                {busy ? "Sending..." : "Request a callback"}
              </Button>
              <Button onClick={close} sx={{ color: MUTED, textTransform: "none", fontWeight: 600 }}>
                Not now
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
