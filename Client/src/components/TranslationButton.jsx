import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Translate,
  ContentCopy,
  Check,
  Close,
  Language,
} from "@mui/icons-material";

const TranslationButton = ({
  text,
  onTranslate,
  translatedText,
  loading = false,
  error = null,
  variant = "contained",
  size = "medium",
  position = "static",
  showIcon = true,
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (onTranslate && text) {
      await onTranslate(text);
    }
    setOpen(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCopied(false);
  };

  return (
    <>
      <Tooltip title="Translate to Urdu">
        <span>
          <Button
            variant={variant}
            size={size}
            startIcon={showIcon && <Translate />}
            onClick={handleTranslate}
            disabled={loading || !text}
            sx={{
              ...(position === "fixed" && {
                position: "fixed",
                bottom: 20,
                left: 20,
                zIndex: 9999,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }),
              ...props.sx,
            }}
            {...props}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : (
              "Translate to Urdu"
            )}
          </Button>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Language sx={{ mr: 1, color: "primary.main" }} />
              <Typography variant="h6">English to Urdu Translation</Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Original Text (English):
            </Typography>
            <Paper
              elevation={1}
              sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}
            >
              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                {text}
              </Typography>
            </Paper>
          </Box>

          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1.6,
                  direction: "rtl", // Right-to-left for Urdu
                  textAlign: "right", // Align right for Urdu
                  fontFamily:
                    "'Noto Sans Arabic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  fontSize: "1.1rem",
                  minHeight: "60px",
                }}
              >
                {translatedText}
              </Typography>
              <Chip
                label="Urdu"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Box>

            {error ? (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                Translation failed: {error}
              </Alert>
            ) : loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 4,
                }}
              >
                <CircularProgress size={24} />
                <Typography variant="body2" sx={{ ml: 2 }}>
                  Translating...
                </Typography>
              </Box>
            ) : translatedText ? (
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: "success.50",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "success.200",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.6,
                    direction: "rtl",
                    textAlign: "right",
                    fontFamily:
                      "'Noto Sans Arabic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: "1.1rem",
                    minHeight: "60px",
                  }}
                >
                  {translatedText}
                </Typography>

                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Tooltip title={copied ? "Copied!" : "Copy Urdu text"}>
                    <Button
                      size="small"
                      startIcon={copied ? <Check /> : <ContentCopy />}
                      onClick={handleCopy}
                      variant="outlined"
                      color={copied ? "success" : "primary"}
                    >
                      {copied ? "Copied" : "Copy Urdu Text"}
                    </Button>
                  </Tooltip>
                </Box>
              </Paper>
            ) : (
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                Click "Translate" to convert English text to Urdu
              </Alert>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button
            variant="contained"
            onClick={handleTranslate}
            disabled={loading || !text}
            startIcon={<Translate />}
          >
            {translatedText ? "Translate Again" : "Translate"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TranslationButton;
