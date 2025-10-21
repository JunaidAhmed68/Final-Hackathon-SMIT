import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Alert,
  Fade,
  InputAdornment,
  Chip,
} from "@mui/material";
import {
  Close,
  Email,
  VerifiedUser,
  Security,
  CheckCircle,
  ContentCopy,
} from "@mui/icons-material";

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc'
};

const EmailConfirmationModal = ({ email, onVerified, onClose }) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (!code.trim()) {
      toast.warning("Please enter the verification code");
      return;
    }

    if (code.length < 6) {
      toast.warning("Verification code must be 6 digits");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:3000/confirm-email/verify", {
        email,
        code: code.trim(),
      });
      toast.success("🎉 Email verified successfully!");
      onVerified();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Verification failed. Please check the code and try again.";
      toast.error(errorMessage);
      setAttempts(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      await axios.post("http://localhost:3000/confirm-email/send", { email });
      setTimer(60); // 60 seconds cooldown
      toast.info("📧 New verification code sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && code.trim().length >= 6 && !loading) {
      handleVerify();
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.info("Email copied to clipboard!");
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: `linear-gradient(135deg, ${theme.background}, #ffffff)`,
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          color: 'white',
          position: 'relative',
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
          }}
        >
          <Close />
        </IconButton>
        
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <VerifiedUser sx={{ fontSize: 48, mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Verify Your Email
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mt: 1 }}>
            Secure account verification
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <Fade in={true} timeout={500}>
          <Box>
            {/* Security Alert */}
            <Alert 
              severity="info" 
              icon={<Security />}
              sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: `${theme.primary}08`,
                border: `1px solid ${theme.primary}20`,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                For your security, please verify your email address
              </Typography>
            </Alert>

            {/* Email Display */}
            <Box 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderRadius: 3,
                backgroundColor: 'grey.50',
                border: '1px solid',
                borderColor: 'grey.200',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: 'text.secondary' }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Verification code sent to
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {email}
                  </Typography>
                </Box>
              </Box>
              <IconButton onClick={copyEmail} size="small">
                <ContentCopy sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>

            {/* Verification Code Input */}
            <TextField
              fullWidth
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyPress={handleKeyPress}
              placeholder="Enter 6-digit code"
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CheckCircle color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  '&:hover fieldset': {
                    borderColor: theme.primary,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.primary,
                  },
                },
              }}
              helperText="Check your email inbox for the 6-digit verification code"
            />

            {/* Attempts Counter */}
            {attempts > 0 && (
              <Chip 
                label={`${attempts} verification attempt${attempts !== 1 ? 's' : ''}`}
                color={attempts >= 3 ? "warning" : "default"}
                variant="outlined"
                size="small"
                sx={{ mb: 2 }}
              />
            )}

            {/* Resend Code Section */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              <Button
                onClick={handleResendCode}
                disabled={resendLoading || timer > 0}
                startIcon={resendLoading ? <CircularProgress size={16} /> : <Email />}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                }}
              >
                {resendLoading ? 'Sending...' : 
                 timer > 0 ? `Resend in ${formatTime(timer)}` : 
                 'Resend Code'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          fullWidth
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleVerify}
          disabled={loading || code.trim().length < 6}
          variant="contained"
          fullWidth
          startIcon={loading ? <CircularProgress size={20} /> : <VerifiedUser />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            boxShadow: `0 4px 15px ${theme.primary}40`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 25px ${theme.primary}60`,
            },
            '&:disabled': {
              background: 'grey.300',
              transform: 'none',
              boxShadow: 'none',
            },
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailConfirmationModal;