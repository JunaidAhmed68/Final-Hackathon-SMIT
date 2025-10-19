import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  List, 
  ListItem, 
  ListItemAvatar,
  ListItemText, 
  Divider,
  CircularProgress,
  Paper,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  UploadFile,
  Favorite,
  Insights,
  CalendarToday,
  ArrowForward,
  HealthAndSafety,
  TrendingUp,
  Description
} from '@mui/icons-material';

// Custom theme colors
const theme = {
  primary: '#2563eb',
  secondary: '#7c3aed',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc'
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/ai/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;

        setReports(
          data
            .filter(item => item.type === 'file')
            .map(item => ({
              ...item,
              data: { 
                ...item.data, 
                uploadDate: new Date(item.data.uploadDate),
                previewImage: item.data.previewImage || '/api/placeholder/80/60'
              },
            }))
        );

        setVitals(
          data
            .filter(item => item.type === 'vitals')
            .map(item => ({
              ...item,
              data: { ...item.data, date: new Date(item.data.date) },
            }))
        );

        setInsights(
          data
            .filter(item => item.type === 'insight')
            .map(item => ({
              ...item,
              data: { 
                ...item.data, 
                createdAt: new Date(item.data.createdAt),
                severity: item.data.severity || 'info'
              },
            }))
        );

      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return theme.error;
      case 'medium': return theme.warning;
      case 'low': return theme.success;
      default: return theme.primary;
    }
  };

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}20`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: theme.primary }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
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
          Health Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
          Welcome to your personalized health monitoring dashboard
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Description />}
              title="Reports"
              value={reports.length}
              subtitle="Medical documents"
              color={theme.primary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Favorite />}
              title="Vitals"
              value={vitals.length}
              subtitle="Health metrics"
              color={theme.error}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<Insights />}
              title="Insights"
              value={insights.length}
              subtitle="AI analysis"
              color={theme.secondary}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<TrendingUp />}
              title="Trend"
              value="Stable"
              subtitle="Overall health"
              color={theme.success}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Reports Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1, color: theme.primary }} />
              Medical Reports
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Your uploaded medical documents and test results
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/upload-report')}
            startIcon={<UploadFile />}
            sx={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${theme.primary}40`
              }
            }}
          >
            Upload Report
          </Button>
        </Box>

        <List sx={{ mb: 2 }}>
          {reports.length > 0 ? (
            reports.slice(0, 3).map((report, index) => (
              <React.Fragment key={index}>
                <ListItem 
                  button 
                  onClick={() => navigate(`/view-report/${report.data._id}`)}
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: `${theme.primary}08`,
                      transform: 'translateX(8px)'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded"
                      sx={{ 
                        bgcolor: `${theme.primary}10`,
                        color: theme.primary
                      }}
                    >
                      <Description />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {report.data.originalName}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                        <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Uploaded {report.data.uploadDate.toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ArrowForward sx={{ color: 'text.secondary' }} />
                </ListItem>
                {index < reports.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Description sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography color="text.secondary">
                No medical reports uploaded yet.
              </Typography>
            </Box>
          )}
        </List>

        {reports.length > 3 && (
          <Button 
            fullWidth 
            variant="outlined"
            sx={{ 
              borderRadius: 3,
              borderColor: theme.primary,
              color: theme.primary,
              '&:hover': {
                borderColor: theme.primary,
                backgroundColor: `${theme.primary}08`
              }
            }}
          >
            View All Reports ({reports.length})
          </Button>
        )}
      </Paper>

      {/* Vitals Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          mb: 4,
          background: `linear-gradient(135deg, ${theme.background}, #ffffff)`,
          border: `1px solid ${theme.error}20`,
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
            background: `linear-gradient(180deg, ${theme.error}, ${theme.warning})`
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Favorite sx={{ mr: 1, color: theme.error }} />
              Health Vitals
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Recent vital signs and health metrics
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/add-vitals')}
            startIcon={<HealthAndSafety />}
            sx={{
              background: `linear-gradient(135deg, ${theme.error}, ${theme.warning})`,
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: `0 6px 20px ${theme.error}40`
              }
            }}
          >
            Add Vitals
          </Button>
        </Box>

        <Grid container spacing={2}>
          {vitals.length > 0 ? (
            vitals.slice(0, 2).map((vital, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    border: `1px solid ${theme.error}20`,
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${theme.error}20`
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {vital.data.date.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Blood Pressure
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vital.data.bloodPressure?.systolic || '-'}/{vital.data.bloodPressure?.diastolic || '-'}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Heart Rate
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vital.data.heartRate || '-'} bpm
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          Temperature
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {vital.data.temperature || '-'}°C
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Favorite sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography color="text.secondary">
                  No vitals recorded yet.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      {/* AI Insights Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 4,
          background: `linear-gradient(135deg, ${theme.background}, #ffffff)`,
          border: `1px solid ${theme.secondary}20`,
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
            background: `linear-gradient(180deg, ${theme.secondary}, ${theme.primary})`
          }
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
            <Insights sx={{ mr: 1, color: theme.secondary }} />
            AI Health Insights
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Intelligent analysis of your health data
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {insights.length > 0 ? (
            insights.slice(0, 2).map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    border: `1px solid ${getSeverityColor(insight.data.severity)}30`,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${getSeverityColor(insight.data.severity)}08, #ffffff)`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 15px ${getSeverityColor(insight.data.severity)}20`
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Chip 
                        label={insight.data.severity?.toUpperCase() || 'INFO'} 
                        size="small"
                        sx={{ 
                          bgcolor: `${getSeverityColor(insight.data.severity)}20`,
                          color: getSeverityColor(insight.data.severity),
                          fontWeight: 600
                        }}
                      />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {insight.data.createdAt.toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                      {insight.data.fileAnalysis?.summary || 'No summary available'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Insights sx={{ fontSize: 48, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography color="text.secondary">
                  No AI insights generated yet.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;