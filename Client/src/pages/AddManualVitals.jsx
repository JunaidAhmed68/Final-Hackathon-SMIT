import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip,
  Fade,
  Chip,
  Divider,
} from "@mui/material";
import {
  Favorite,
  MonitorHeart,
  Scale,
  Thermostat,
  Bloodtype,
  CalendarToday,
  Notes,
  ArrowBack,
  Save,
  TrendingUp,
  LocalHospital,
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4'
};

const AddManualVitals = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    weight: "",
    heartRate: "",
    temperature: "",
    notes: "",
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate individual field
  const validateField = (name, value) => {
    const newErrors = { ...errors };
    
    switch (name) {
      case 'systolic':
        if (value && (value < 70 || value > 200)) {
          newErrors.systolic = 'Systolic BP should be between 70-200';
        } else {
          delete newErrors.systolic;
        }
        break;
      case 'diastolic':
        if (value && (value < 40 || value > 130)) {
          newErrors.diastolic = 'Diastolic BP should be between 40-130';
        } else {
          delete newErrors.diastolic;
        }
        break;
      case 'heartRate':
        if (value && (value < 30 || value > 200)) {
          newErrors.heartRate = 'Heart rate should be between 30-200 bpm';
        } else {
          delete newErrors.heartRate;
        }
        break;
      case 'temperature':
        if (value && (value < 35 || value > 42)) {
          newErrors.temperature = 'Temperature should be between 35-42°C';
        } else {
          delete newErrors.temperature;
        }
        break;
      case 'weight':
        if (value && (value < 20 || value > 300)) {
          newErrors.weight = 'Weight should be between 20-300 kg';
        } else {
          delete newErrors.weight;
        }
        break;
      case 'bloodSugar':
        if (value && (value < 50 || value > 500)) {
          newErrors.bloodSugar = 'Blood sugar should be between 50-500 mg/dL';
        } else {
          delete newErrors.bloodSugar;
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
  };

  // Handle field change with validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
    
    if (value) {
      validateField(name, value);
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Get BP category
  const getBPCategory = () => {
    const sys = parseInt(vitals.systolic);
    const dia = parseInt(vitals.diastolic);
    
    if (!sys || !dia) return null;
    
    if (sys < 90 || dia < 60) return { label: "Low", color: theme.info };
    if (sys < 120 && dia < 80) return { label: "Normal", color: theme.success };
    if (sys < 130 && dia < 80) return { label: "Elevated", color: theme.warning };
    if (sys < 140 || dia < 90) return { label: "High Stage 1", color: theme.warning };
    return { label: "High Stage 2", color: theme.error };
  };

  const bpCategory = getBPCategory();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vitals.systolic || !vitals.diastolic) {
      return toast.error("Please enter both systolic and diastolic BP values.");
    }

    if (Object.keys(errors).length > 0) {
      return toast.error("Please fix the validation errors before submitting.");
    }

    setLoading(true);
    try {
      const token = Cookies.get("token");
      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      await axios.post(
        "http://localhost:3000/ai/add-vitals",
        {
          date: vitals.date ? new Date(vitals.date) : new Date(),
          bloodPressure: {
            systolic: Number(vitals.systolic),
            diastolic: Number(vitals.diastolic),
          },
          bloodSugar: vitals.bloodSugar ? Number(vitals.bloodSugar) : null,
          weight: vitals.weight ? Number(vitals.weight) : null,
          heartRate: vitals.heartRate ? Number(vitals.heartRate) : null,
          temperature: vitals.temperature ? Number(vitals.temperature) : null,
          notes: vitals.notes || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Vitals added successfully!");
     
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add vitals!");
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, unit, color }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 4px 12px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ color: color, mb: 1 }}>{icon}</Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ color: color, fontWeight: 700 }}>
          {value || '-'} {unit}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ 
            mb: 2,
            color: theme.primary,
            '&:hover': {
              backgroundColor: `${theme.primary}10`
            }
          }}
        >
          Back to Dashboard
        </Button>
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 1
          }}
        >
          Record Vitals
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          Track your health metrics and monitor your wellbeing
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Quick Stats Preview */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              background: `linear-gradient(135deg, ${theme.background}, #ffffff)`,
              border: `1px solid ${theme.primary}20`,
              borderRadius: 4,
              position: 'sticky',
              top: 100
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              <TrendingUp sx={{ mr: 1, color: theme.primary }} />
              Quick Preview
            </Typography>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <StatCard
                  icon={<MonitorHeart sx={{ fontSize: 24 }} />}
                  title="Blood Pressure"
                  value={vitals.systolic && vitals.diastolic ? `${vitals.systolic}/${vitals.diastolic}` : null}
                  unit="mmHg"
                  color={bpCategory?.color || theme.primary}
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  icon={<Favorite sx={{ fontSize: 24 }} />}
                  title="Heart Rate"
                  value={vitals.heartRate}
                  unit="bpm"
                  color={theme.error}
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  icon={<Bloodtype sx={{ fontSize: 24 }} />}
                  title="Blood Sugar"
                  value={vitals.bloodSugar}
                  unit="mg/dL"
                  color={theme.secondary}
                />
              </Grid>
              <Grid item xs={6}>
                <StatCard
                  icon={<Thermostat sx={{ fontSize: 24 }} />}
                  title="Temperature"
                  value={vitals.temperature}
                  unit="°C"
                  color={theme.warning}
                />
              </Grid>
            </Grid>

            {bpCategory && (
              <Alert 
                severity={
                  bpCategory.color === theme.success ? 'success' :
                  bpCategory.color === theme.warning ? 'warning' :
                  bpCategory.color === theme.error ? 'error' : 'info'
                }
                sx={{ borderRadius: 3 }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  BP Category: {bpCategory.label}
                </Typography>
              </Alert>
            )}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <LocalHospital sx={{ fontSize: 48, color: `${theme.primary}30`, mb: 1 }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Regular monitoring helps in early detection of health issues
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Form Section */}
        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={800}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4,
                background: `linear-gradient(135deg, ${theme.background}, #ffffff)`,
                border: `1px solid ${theme.primary}20`,
                borderRadius: 4,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '4px',
                  height: '100%',
                  background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`
                }
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  {/* Date */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Record Date"
                      type="date"
                      name="date"
                      value={vitals.date}
                      onChange={handleChange}
                      InputLabelProps={{ shrink: true }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ color: theme.primary }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Blood Pressure Row */}
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <MonitorHeart sx={{ mr: 1, color: theme.primary }} />
                      Blood Pressure
                      {bpCategory && (
                        <Chip 
                          label={bpCategory.label} 
                          size="small" 
                          sx={{ 
                            ml: 2,
                            bgcolor: `${bpCategory.color}20`,
                            color: bpCategory.color,
                            fontWeight: 600
                          }} 
                        />
                      )}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Systolic (mmHg)"
                      name="systolic"
                      type="number"
                      value={vitals.systolic}
                      onChange={handleChange}
                      error={!!errors.systolic}
                      helperText={errors.systolic}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              mmHg
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Diastolic (mmHg)"
                      name="diastolic"
                      type="number"
                      value={vitals.diastolic}
                      onChange={handleChange}
                      error={!!errors.diastolic}
                      helperText={errors.diastolic}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              mmHg
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Other Vitals */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Heart Rate"
                      name="heartRate"
                      type="number"
                      value={vitals.heartRate}
                      onChange={handleChange}
                      error={!!errors.heartRate}
                      helperText={errors.heartRate}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Favorite sx={{ color: theme.error }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              bpm
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Sugar"
                      name="bloodSugar"
                      type="number"
                      value={vitals.bloodSugar}
                      onChange={handleChange}
                      error={!!errors.bloodSugar}
                      helperText={errors.bloodSugar}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Bloodtype sx={{ color: theme.secondary }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              mg/dL
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Weight"
                      name="weight"
                      type="number"
                      value={vitals.weight}
                      onChange={handleChange}
                      error={!!errors.weight}
                      helperText={errors.weight}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Scale sx={{ color: theme.info }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              kg
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Temperature"
                      name="temperature"
                      type="number"
                      value={vitals.temperature}
                      onChange={handleChange}
                      error={!!errors.temperature}
                      helperText={errors.temperature}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Thermostat sx={{ color: theme.warning }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              °C
                            </Typography>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Notes */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Notes"
                      name="notes"
                      value={vitals.notes}
                      onChange={handleChange}
                      multiline
                      rows={4}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Notes sx={{ color: theme.primary, mt: -2 }} />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Any symptoms, concerns, or additional information..."
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={loading || Object.keys(errors).length > 0}
                      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
                      sx={{
                        background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                        borderRadius: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${theme.primary}40`
                        },
                        '&:disabled': {
                          background: 'grey.300'
                        }
                      }}
                    >
                      {loading ? 'Saving Vitals...' : 'Save Health Record'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddManualVitals;