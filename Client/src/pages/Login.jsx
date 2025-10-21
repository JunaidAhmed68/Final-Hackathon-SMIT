import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
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
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
} from "@mui/icons-material";
import HealthMateLogo from "../components/HealthMateLogo"; // Make sure this path is correct

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  background: '#f8fafc'
};

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ 
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("https://final-hackathon-smit-eight.vercel.app/auth/login", data);
      const { user, token } = res.data;

      Cookies.set("token", token, { expires: 7 });
      setUser(user);
      toast.success("Welcome back! Login successful.");
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
              <HealthMateLogo size={56} /> {/* Increased size for better visibility */}
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
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                maxWidth: 400,
                mx: 'auto',
              }}
            >
              Sign in to your account to access your health dashboard and medical insights
            </Typography>
          </Box>

          {/* Login Form */}
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
                autoFocus
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
                autoComplete="current-password"
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
              />

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <NavLink
                  to="/forgotpassword"
                  style={{
                    textDecoration: 'none',
                    color: theme.primary,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                  }}
                >
                  Forgot your password?
                </NavLink>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
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
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', px: 2 }}>
                  Or
                </Typography>
              </Divider>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Don't have an account?
                </Typography>
                <NavLink
                  to="/signup"
                  style={{
                    textDecoration: 'none',
                    color: theme.primary,
                    fontWeight: 600,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Create an account
                  <ArrowForward sx={{ fontSize: 18, ml: 0.5 }} />
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
              🔒 Your health data is securely encrypted and protected
            </Typography>
          </Alert>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;