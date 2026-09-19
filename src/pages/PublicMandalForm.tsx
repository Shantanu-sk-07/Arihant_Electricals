import { useState, type FormEvent } from "react";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import AddCircleOutlineIcon from "@mui/icons-material/Add";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { ADMIN_WHATSAPP, BUCKET_NAME, supabase } from "../supabase";
import { INFORMATION_TYPES, type InformationType } from "../types";
import { photoUrlsToString } from "../utils/photoUtils";
import { showSnackbar } from "../components/ToastMessage";
import PhotoUpload from "../components/PhotoUpload";

interface FormValues {
  mandal_name: string;
  president_name: string;
  president_mobile: string;
  mandal_village: string;
  information_type: InformationType | "";
}

interface FormErrors {
  mandal_name?: string;
  president_name?: string;
  president_mobile?: string;
  information_type?: string;
  photos?: string;
  mandal_village?: string;
}

const initialValues: FormValues = {
  mandal_name: "",
  mandal_village: "",
  president_name: "",
  president_mobile: "",
  information_type: "",
};

type PhotoItem = File | string;

function PublicMandalForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [showWhatsappFallback, setShowWhatsappFallback] = useState(false);

  const methods = useForm({
    defaultValues: {
      photos: [] as PhotoItem[],
      deletedPhotos: [] as unknown,
    },
  });

  const patch = (p: Partial<FormValues>) =>
    setValues((prev) => ({ ...prev, ...p }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!values.mandal_name.trim()) e.mandal_name = "मंडळाचे नाव भरा.";
    if (!/^[6-9][0-9]{9}$/.test(values.president_mobile))
      e.president_mobile = "कृपया योग्य 10 अंकी मोबाईल नंबर टाका.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setSuccess(false);

    const rawPhotos =
      (methods.getValues("photos") as PhotoItem[] | undefined) ?? [];
    const filePhotos = rawPhotos.filter((p): p is File => p instanceof File);

    if (!validate()) return;

    setLoading(true);
    const uploadedPaths: string[] = [];

    try {
          const uploadResults = await Promise.all(
        filePhotos.map(async (file) => {
          const ext =
            file.type === "image/png"
              ? "png"
              : file.type === "image/webp"
                ? "webp"
                : "jpg";
          const shortId = `${Date.now().toString(36)}-${Math.random()
            .toString(36)
            .slice(2, 7)}`;
          const path = `${shortId}.${ext}`;

          const { error: uploadError } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(path, file, {
              cacheControl: "3600",
              contentType: file.type,
              upsert: false,
            });

          if (uploadError)
            throw new Error(`फोटो अपलोड झाला नाही: ${uploadError.message}`);

          const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
          return { path, url: data.publicUrl };
        })
      );

      const urls: string[] = [];
      for (const r of uploadResults) {
        uploadedPaths.push(r.path);
        urls.push(r.url);
      }

      const { error: dbError } = await supabase
        .from("ganesh_mandal_records_2026")
        .insert({
          mandal_name: values.mandal_name.trim(),
          mandal_village: values.mandal_village.trim() || null,
          president_name: values.president_name.trim(),
          president_mobile: values.president_mobile,
          idol_photo_url: photoUrlsToString(urls),
          information_type: values.information_type,
        });

      if (dbError) {
        await supabase.storage.from(BUCKET_NAME).remove(uploadedPaths);
        throw new Error(`माहिती सेव्ह झाली नाही: ${dbError.message}`);
      }

      const heroLine =
        values.information_type === INFORMATION_TYPES.TAKEN
          ? "✨ *२०२६ गणेशमूर्ती नोंदणी* ✨"
          : "✨ *पुढील वर्षाची गणेशमूर्ती नोंदणी* ✨";

      const photoLines = urls.map((u, i) => `🖼️ ${i + 1}) ${u}`);

      const message = [
        "🙏 *नमस्कार* 🙏",
        "🕉️ *सिद्धिविनायक आर्ट्स* 🕉️",
        heroLine,
        "",
        `🏛️ *मंडळ:* ${values.mandal_name.trim()}`,
        `📍 *गाव:* ${values.mandal_village.trim() || "—"}`,
        `👤 *अध्यक्ष:* ${values.president_name.trim()}`,
        `📞 *मोबाईल:* ${values.president_mobile}`,
        "",
        "📷 *मूर्तीचे फोटो:*",
        ...photoLines,
        "",
        "🙏 *गणपती बाप्पा मोरया* 🙏",
      ].join("\n");

      const waUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(
        message,
      )}`;

      setWhatsappUrl(waUrl);
      setSuccess(true);
      setValues(initialValues);
      setErrors({});
      methods.reset({ photos: [], deletedPhotos: [] });
      showSnackbar("success", "माहिती यशस्वीरित्या नोंदवली गेली!");
      const waWindow = window.open(waUrl, "_blank");
      if (!waWindow) {
        setShowWhatsappFallback(true);
      } else {
        setShowWhatsappFallback(false);
        waWindow.opener = null;
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.";
      showSnackbar("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: { xs: 2, sm: 3 },
        px: { xs: 1.5, sm: 2 },
        position: "relative",
        background:
          "radial-gradient(circle at top, #fffaf4 0%, #f6efe6 45%, #eee1d2 100%)",
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          top: "10%",
          right: "-80px",
          fontSize: 260,
          opacity: 0.04,
          color: "#7c2905",
          fontWeight: 900,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        ॐ
      </Box>
      <Box
        aria-hidden="true"
        sx={{
          position: "fixed",
          bottom: "-40px",
          left: "-60px",
          fontSize: 200,
          opacity: 0.035,
          color: "#7c2905",
          fontWeight: 900,
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        ॐ
      </Box>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: { xs: 2.5, sm: 3 },
            borderRadius: 3,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            background: "linear-gradient(135deg, #fffdfa 0%, #faf3ea 100%)",
          }}
        >
          <Box
            sx={{
              width: 52,
              height: 52,
              mx: "auto",
              mb: 1.5,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(145deg, #b96b13, #7c3907)",
              color: "#fff8e8",
              fontSize: 24,
              fontWeight: 700,
              boxShadow: "0 8px 20px rgba(126, 64, 13, 0.28)",
            }}
          >
            ॐ
          </Box>

          <Typography
            variant="h5"
            sx={{
              color: "primary.dark",
              fontWeight: 800,
              mb: 1,
              fontSize: { xs: 20, sm: 26 },
            }}
          >
            गणेशमूर्ती मंडळ माहिती नोंदणी २०२६
          </Typography>

          <Typography
            sx={{
              color: "text.secondary",
              fontSize: { xs: 13, sm: 14 },
              lineHeight: 1.7,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            २०२६ मध्ये गणेशमूर्ती घेतलेल्या तसेच आगामी वर्षासाठी अपेक्षित
            असलेल्या मंडळांनी खालील माहिती अचूकपणे भरावी.
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 3.5 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                <TextField
                  label="मंडळाचे नाव"
                  value={values.mandal_name}
                  onChange={(e) => patch({ mandal_name: e.target.value })}
                  placeholder="उदा. श्री गणेश मित्र मंडळ"
                  required
                  fullWidth
                  error={Boolean(errors.mandal_name)}
                  helperText={errors.mandal_name}
                  autoComplete="organization"
                />

                <TextField
                  label="मंडळाचे गाव / पत्ता "
                  value={values.mandal_village}
                  onChange={(e) => patch({ mandal_village: e.target.value })}
                  placeholder="उदा. श्री गणेश मित्र मंडळ,कुरूंदवाड ( शिवाजी चौक जवळ ) "
                  fullWidth
                  error={Boolean(errors.mandal_village)}
                  helperText={errors.mandal_village}
                  autoComplete="street-address"
                />

                <TextField
                  label="अध्यक्षाचे नाव"
                  value={values.president_name}
                  onChange={(e) => patch({ president_name: e.target.value })}
                  placeholder="अध्यक्षाचे पूर्ण नाव"
                  fullWidth
                  error={Boolean(errors.president_name)}
                  helperText={errors.president_name}
                  autoComplete="name"
                />

                <TextField
                  label="अध्यक्षाचा मोबाईल नंबर"
                  value={values.president_mobile}
                  onChange={(e) => {
                    const only = e.target.value.replace(/\D/g, "").slice(0, 10);
                    patch({ president_mobile: only });
                  }}
                  placeholder="10 अंकी मोबाईल नंबर"
                  fullWidth
                  error={Boolean(errors.president_mobile)}
                  helperText={errors.president_mobile}
                  autoComplete="tel"
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      maxLength: 10,
                    },
                  }}
                />

                <Box>
                  <PhotoUpload
                    name="photos"
                    label="मंडळाच्या सजावट/डिझाइनमधील गणेशमूर्तीचे फोटो"
                    placeholder="फोटो निवडा "
                    maxFiles={3}
                    maxSizeMB={10}
                    targetSizeKB={2000}
                    compress={true}
                    cropEnabled={false}
                    cameraEnabled
                    size="small"
                  />
                  {errors.photos && (
                    <Box
                      sx={{
                        color: "error.main",
                        fontSize: 12,
                        mt: 0.5,
                        ml: 1.75,
                      }}
                    >
                      {errors.photos}
                    </Box>
                  )}
                </Box>

                <FormControl
                  error={Boolean(errors.information_type)}
                  component="fieldset"
                >
                  <FormLabel
                    component="legend"
                    sx={{
                      fontWeight: 700,
                      color: "text.primary !important",
                    }}
                  >
                    माहितीचा प्रकार{" "}
                    <Box component="span" sx={{ color: "error.main" }}>
                      *
                    </Box>
                  </FormLabel>
                  <RadioGroup
                    value={values.information_type}
                    onChange={(e) =>
                      patch({
                        information_type: e.target.value as InformationType,
                      })
                    }
                  >
                    <FormControlLabel
                      value={INFORMATION_TYPES.TAKEN}
                      control={<Radio />}
                      label={INFORMATION_TYPES.TAKEN}
                    />
                    <FormControlLabel
                      value={INFORMATION_TYPES.UPCOMING}
                      control={<Radio />}
                      label={INFORMATION_TYPES.UPCOMING}
                    />
                  </RadioGroup>
                  {errors.information_type && (
                    <Box
                      sx={{
                        color: "error.main",
                        fontSize: 12,
                        mt: 0.5,
                        ml: 1.75,
                      }}
                    >
                      {errors.information_type}
                    </Box>
                  )}
                </FormControl>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
                sx={{
                  mt: 3,
                  py: 1.6,
                  fontSize: 16,
                  fontWeight: 800,
                }}
              >
                {loading ? "कृपया थांबा..." : "Submit & WhatsApp वर पाठवा"}
              </Button>

              {success && (
                <Alert
                  severity="success"
                  sx={{
                    mt: 2,
                    "& .MuiAlert-message": { width: "100%" },
                  }}
                >
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                    🙏 धन्यवाद!
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1.5, lineHeight: 1.7 }}>
                    आपल्या मंडळाची माहिती यशस्वीरित्या नोंदवली गेली आहे.
                    <br />
                    गणेशमूर्तीचा फोटो व इतर माहिती प्राप्त झाली आहे.
                  </Typography>

                  {/* WhatsApp block zala tar extra message */}
                  {showWhatsappFallback && whatsappUrl && (
                    <Alert
                      severity="warning"
                      icon={false}
                      sx={{
                        mb: 1.5,
                        py: 0.5,
                        px: 1.25,
                        fontSize: 12.5,
                        lineHeight: 1.6,
                        bgcolor: "#fff8e1",
                        color: "#7a5c00",
                        "& .MuiAlert-message": { p: 0 },
                      }}
                    >
                      ⚠️ WhatsApp आपोआप उघडला नाही. कृपया खालील बटणावर क्लिक
                      करून WhatsApp उघडा आणि मेसेज <strong>Send</strong> करा.
                    </Alert>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      alignItems: { xs: "flex-start", sm: "center" },
                      gap: { xs: 0.75, sm: 2 },
                    }}
                  >
                    {/* WhatsApp button — fakt jar popup block zala tar */}
                    {showWhatsappFallback && whatsappUrl && (
                      <Box
                        component="a"
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          color: "#25D366",
                          fontWeight: 700,
                          textDecoration: "underline",
                          fontSize: 13,
                          "&:hover": {
                            color: "#128C7E",
                          },
                        }}
                      >
                        <WhatsAppIcon sx={{ fontSize: 16 }} />
                        WhatsApp पुन्हा उघडा
                      </Box>
                    )}

                    {/* Nava entry link */}
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setSuccess(false);
                        setWhatsappUrl("");
                        setShowWhatsappFallback(false);
                        setValues(initialValues);
                        setErrors({});
                        methods.reset({ photos: [], deletedPhotos: [] });
                      }}
                      sx={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "primary.main",
                        fontWeight: 700,
                        textDecoration: "underline",
                        fontSize: 13,
                        fontFamily: "inherit",
                        "&:hover": {
                          color: "primary.dark",
                        },
                      }}
                    >
                      <AddCircleOutlineIcon sx={{ fontSize: 16 }} />
                      नवीन नोंद करा
                    </Box>
                  </Box>
                </Alert>
              )}
            </form>
          </FormProvider>
        </Paper>

        <Divider sx={{ my: 2.5 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
            fontSize: 13,
            pb: 2,
          }}
        >
          <MuiLink
            component={Link}
            to="/admin/login"
            sx={{
              color: "text.secondary",
              textDecoration: "underline",
            }}
          >
            <span>गणेशमूर्ती मंडळ माहिती नोंदणी • २०२६</span>
            <span>•</span>
          </MuiLink>
        </Box>
      </Container>
    </Box>
  );
}

export default PublicMandalForm;
