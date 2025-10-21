import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  LinearProgress,
  Box,
  Container,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Fade,
  Chip,
  Divider,
} from "@mui/material";
import {
  MailOutline,
  ArrowBack,
  Security,
  LockReset,
  CheckCircle,
  ContentCopy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc'
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [timer, setTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const intervalRef = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer) {
      setTimeLeft(60); // 1 minute = 60 seconds
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimer(false);
            setDisableButton(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [timer]);

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Please enter your email!");
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setDisableButton(true);

    try {
      const res = await axios.post(
        "https://final-hackathon-smit-eight.vercel.app/auth/forgot-password",
        { email }
      );
      toast.success("📧 Password reset link sent successfully!");
      setTimer(true);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link. Please try again.");
      setDisableButton(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.info("Email copied to clipboard!");
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.background} 0%, #ffffff 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackToLogin}
            sx={{
              alignSelf: 'flex-start',
              mb: 2,
              color: 'text.secondary',
              '&:hover': {
                color: theme.primary,
              }
            }}
          >
            Back to Login
          </Button>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockReset 
                sx={{ 
                  fontSize: 48, 
                  color: theme.primary,
                  mr: 2 
                }} 
              />
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Reset Password
              </Typography>
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Recover your account access
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              Enter your email address and we'll send you a link to reset your password
            </Typography>
          </Box>

          {/* Main Card */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              background: 'white',
              border: `1px solid ${theme.primary}20`,
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {!isSubmitted ? (
              <Fade in={true}>
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
                      We'll send a secure password reset link to your email
                    </Typography>
                  </Alert>

                  <form onSubmit={handleForgot}>
                    <TextField
                      type="email"
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={disableButton}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MailOutline sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: theme.primary,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.primary,
                          },
                        },
                      }}
                      helperText="Enter the email address associated with your account"
                    />

                    <Button
                      variant="contained"
                      fullWidth
                      type="submit"
                      disabled={disableButton}
                      startIcon={disableButton ? null : <MailOutline />}
                      sx={{
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontSize: '1.1rem',
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
                      {disableButton
                        ? timeLeft > 0
                          ? `Wait ${formatTime(timeLeft)}`
                          : "Sending..."
                        : "Send Reset Link"}
                    </Button>
                  </form>
                </Box>
              </Fade>
            ) : (
              <Fade in={true}>
                <Box sx={{ textAlign: 'center' }}>
                  {/* Success State */}
                  <CheckCircle 
                    sx={{ 
                      fontSize: 64, 
                      color: theme.success,
                      mb: 2 
                    }} 
                  />
                  
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                    Check Your Email!
                  </Typography>

                  <Alert 
                    severity="success"
                    sx={{ 
                      mb: 3, 
                      borderRadius: 3,
                    }}
                  >
                    Password reset link sent successfully to:
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
                      <MailOutline sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {email}
                      </Typography>
                    </Box>
                    <IconButton onClick={copyEmail} size="small">
                      <ContentCopy sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  {/* Progress and Instructions */}
                  {timer && (
                    <Box sx={{ mb: 3 }}>
                      <LinearProgress
                        variant="determinate"
                        value={((60 - timeLeft) / 60) * 100}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          mb: 1,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                          }
                        }}
                      />
                      <Typography
                        variant="caption"
                        color="textSecondary"
                      >
                        You can request a new link in {formatTime(timeLeft)}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 3 }} />

                  {/* Next Steps */}
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Next steps:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip label="1" size="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">Check your email inbox</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip label="2" size="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">Click the reset link</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip label="3" size="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">Create a new password</Typography>
                    </Box>
                  </Box>

                  {/* Resend Button */}
                  {timeLeft === 0 && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleForgot}
                      startIcon={<MailOutline />}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                      }}
                    >
                      Resend Reset Link
                    </Button>
                  )}
                </Box>
              </Fade>
            )}
          </Paper>

          {/* Security Note */}
          <Alert 
            severity="info" 
            sx={{ 
              mt: 3, 
              borderRadius: 3,
              background: 'transparent',
              border: `1px solid ${theme.primary}20`,
              '& .MuiAlert-message': {
                textAlign: 'center',
              }
            }}
          >
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              🔒 For security reasons, reset links expire after a short period
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;