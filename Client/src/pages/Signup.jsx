import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import EmailConfirmationModal from './EmailConfirmationModal.jsx';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Email,
  Cake,
  Lock,
  ArrowForward,
  CheckCircle,
} from '@mui/icons-material';
import HealthMateLogo from '../components/HealthMateLogo.jsx'; // Make sure this path is correct

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  background: '#f8fafc'
};

const schema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  age: yup
    .number()
    .typeError('Age must be a number')
    .positive('Age must be positive')
    .integer('Age must be a whole number')
    .min(13, 'You must be at least 13 years old')
    .max(120, 'Please enter a valid age')
    .required('Age is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
});

const Signup = () => {
  const [showModal, setShowModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [pendingUserData, setPendingUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const watchedPassword = watch('password', '');

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post('https://final-hackathon-smit-eight.vercel.app/confirm-email/send', { email: data.email });
      setRegisteredEmail(data.email);
      setPendingUserData(data);
      setShowModal(true);
      toast.info('Verification email sent! Please check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send verification email');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSuccess = async () => {
    try {
      await axios.post('https://final-hackathon-smit-eight.vercel.app/auth/signup', pendingUserData);
      toast.success('🎉 Account created successfully! You can now log in.');
      setShowModal(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Account creation failed after verification');
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const passwordStrength = () => {
    if (!watchedPassword) return 0;
    let strength = 0;
    if (watchedPassword.length >= 6) strength += 25;
    if (/[A-Z]/.test(watchedPassword)) strength += 25;
    if (/[a-z]/.test(watchedPassword)) strength += 25;
    if (/[0-9]/.test(watchedPassword)) strength += 25;
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = passwordStrength();
    if (strength <= 25) return 'error';
    if (strength <= 50) return 'warning';
    if (strength <= 75) return 'info';
    return 'success';
  };

  const steps = ['Account Details', 'Email Verification', 'Complete'];

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
          {/* Header with Logo */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <HealthMateLogo size={56} />
              <Box sx={{ ml: 2, textAlign: 'left' }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1,
                    mb: 0.5,
                  }}
                >
                  HealthMate
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 500,
                    lineHeight: 1,
                  }}
                >
                  AI Health Assistant
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                mb: 1,
              }}
            >
              Create Your Account
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              Join HealthMate to start tracking your health journey with AI-powered insights
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Stepper activeStep={showModal ? 1 : 0} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Signup Form */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              background: 'white',
              border: `1px solid ${theme.primary}20`,
              borderRadius: 4,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
              }
            }}
          >
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              {/* Username Field */}
              <TextField
                {...register("username")}
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                error={!!errors.username}
                helperText={errors.username?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
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
              />

              {/* Email Field */}
              <TextField
                {...register("email")}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
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
              />

              {/* Age Field */}
              <TextField
                {...register("age")}
                margin="normal"
                required
                fullWidth
                id="age"
                label="Age"
                name="age"
                type="number"
                error={!!errors.age}
                helperText={errors.age?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cake sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  inputProps: { min: 13, max: 120 },
                }}
                sx={{
                  mb: 2,
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
              />

              {/* Password Field */}
              <TextField
                {...register("password")}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 1,
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
              />

              {/* Password Strength Indicator */}
              {watchedPassword && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', mr: 1 }}>
                      Password strength:
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={getPasswordStrengthColor()}
                      sx={{ fontWeight: 600 }}
                    >
                      {passwordStrength()}%
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: 4,
                      backgroundColor: 'grey.200',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${passwordStrength()}%`,
                        height: '100%',
                        backgroundColor: getPasswordStrengthColor() === 'success' ? theme.success : 
                                        getPasswordStrengthColor() === 'warning' ? theme.warning : 
                                        getPasswordStrengthColor() === 'info' ? theme.primary : 'error',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading || !isValid || !isDirty}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowForward />}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                  Already have an account?
                </Typography>
              </Divider>

              {/* Login Link */}
              <Box sx={{ textAlign: 'center' }}>
                <NavLink
                  to="/login"
                  style={{
                    textDecoration: 'none',
                    color: theme.primary,
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <ArrowForward sx={{ fontSize: 18, mr: 0.5, transform: 'rotate(180deg)' }} />
                  Sign in to your account
                </NavLink>
              </Box>
            </Box>
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
              🔒 Your personal health information is protected with enterprise-grade security
            </Typography>
          </Alert>
        </Box>

        {/* Email Confirmation Modal */}
        {showModal && (
          <EmailConfirmationModal
            email={registeredEmail}
            onVerified={handleVerificationSuccess}
            onClose={() => setShowModal(false)}
          />
        )}
      </Container>
    </Box>
  );
};

export default Signup;