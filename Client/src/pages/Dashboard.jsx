import React, { useState, useEffect } from "react";
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
  alpha,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { toast } from "react-toastify";
import AIChat from "../components/AIChat";

import {
  UploadFile,
  Favorite,
  Insights,
  CalendarToday,
  ArrowForward,
  HealthAndSafety,
  TrendingUp,
  Description,
  Thermostat,
  SmartToy,
} from "@mui/icons-material";

// Custom theme colors
const theme = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#f8fafc",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get("http://localhost:3000/ai/timeline", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.data;

        setReports(
          data
            .filter((item) => item.type === "file")
            .map((item) => ({
              ...item,
              data: {
                ...item.data,
                uploadDate: new Date(item.data.uploadDate),
                previewImage:
                  item.data.previewImage || "/api/placeholder/80/60",
              },
            }))
        );

        setVitals(
          data
            .filter((item) => item.type === "vitals")
            .map((item) => ({
              ...item,
              data: { ...item.data, date: new Date(item.data.date) },
            }))
        );

        setInsights(
          data
            .filter((item) => item.type === "insight")
            .map((item) => ({
              ...item,
              data: {
                ...item.data,
                createdAt: new Date(item.data.createdAt),
                severity: item.data.severity || "info",
              },
            }))
        );
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return theme.error;
      case "medium":
        return theme.warning;
      case "low":
        return theme.success;
      default:
        return theme.primary;
    }
  };

  // Add these helper functions to your Dashboard component
  const getBPStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return { label: "No data", color: "#6b7280" };

    if (systolic < 90 || diastolic < 60)
      return { label: "Low", color: "#3b82f6" };
    if (systolic < 120 && diastolic < 80)
      return { label: "Normal", color: "#10b981" };
    if (systolic < 130 && diastolic < 80)
      return { label: "Elevated", color: "#f59e0b" };
    if (systolic < 140 || diastolic < 90)
      return { label: "High Stage 1", color: "#f59e0b" };
    return { label: "High Stage 2", color: "#ef4444" };
  };

  const getHRStatus = (heartRate) => {
    if (!heartRate) return { label: "No data", color: "#6b7280" };

    if (heartRate < 60) return { label: "Low", color: "#3b82f6" };
    if (heartRate <= 100) return { label: "Normal", color: "#10b981" };
    return { label: "High", color: "#ef4444" };
  };

  const getTempStatus = (temperature) => {
    if (!temperature) return { label: "No data", color: "#6b7280" };

    if (temperature < 36.1) return { label: "Low", color: "#3b82f6" };
    if (temperature <= 37.2) return { label: "Normal", color: "#10b981" };
    return { label: "High", color: "#ef4444" };
  };

  const getOverallStatus = (bpStatus, hrStatus, tempStatus) => {
    const statuses = [bpStatus, hrStatus, tempStatus];
    if (statuses.some((s) => s.color === "#ef4444")) return "Critical";
    if (statuses.some((s) => s.color === "#f59e0b")) return "Elevated";
    return "Normal";
  };

  const StatCard = ({ icon, title, value, subtitle, color }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 8px 25px ${color}20`,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: `${color}20`, color: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: color, mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
          
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
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            mb: 1,
          }}
        >
          Health Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
          Welcome to your personalized health monitoring dashboard
        </Typography>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            onClick={() => navigate("/all-reports")}
          >
            <StatCard
              icon={<Description />}
              title="Reports"
              value={reports.length}
              subtitle="Medical documents"
              color={theme.primary}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            onClick={() => navigate("/all-vitals")}
          >
            <StatCard
              icon={<Favorite />}
              title="Vitals"
              value={vitals.length}
              subtitle="Health metrics"
              color={theme.error}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            onClick={() => navigate("/all-insights")}
          >
            <StatCard
              icon={<Insights />}
              title="Insights"
              value={insights.length}
              subtitle="AI analysis"
              color={theme.secondary}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            onClick={() => navigate("/timeline")}
          >
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
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Description sx={{ mr: 1, color: theme.primary }} />
              Medical Reports
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Your uploaded medical documents and test results
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/upload-report")}
            startIcon={<UploadFile />}
            sx={{
              background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
              borderRadius: 3,
              px: 3,
              py: 1,
              fontWeight: 600,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 6px 20px ${theme.primary}40`,
              },
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
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: `${theme.primary}08`,
                      transform: "translateX(8px)",
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: `${theme.primary}10`,
                        color: theme.primary,
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
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 0.5 }}
                      >
                        <CalendarToday
                          sx={{
                            fontSize: 16,
                            mr: 0.5,
                            color: "text.secondary",
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Uploaded{" "}
                          {report.data.uploadDate.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    }
                  />
                  <ArrowForward sx={{ color: "text.secondary" }} />
                </ListItem>
                {index < Math.min(reports.length - 1, 2) && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Description
                sx={{
                  fontSize: 48,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
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
            onClick={() => navigate("/all-reports")} // Add navigation to all reports page
            endIcon={<ArrowForward />}
            sx={{
              borderRadius: 3,
              borderColor: theme.primary,
              color: theme.primary,
              py: 1.2,
              fontWeight: 600,
              "&:hover": {
                borderColor: theme.primary,
                backgroundColor: `${theme.primary}08`,
                transform: "translateY(-1px)",
              },
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
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: `linear-gradient(180deg, ${theme.error}, ${theme.warning})`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Favorite sx={{ mr: 1, color: theme.error }} />
              Health Vitals
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Track and monitor your vital signs over time
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {vitals.length > 2 && (
              <Button
                variant="outlined"
                onClick={() => navigate("/all-vitals")}
                endIcon={<ArrowForward />}
                sx={{
                  borderColor: theme.error,
                  color: theme.error,
                  borderRadius: 3,
                  px: 3,
                  fontWeight: 600,
                  "&:hover": {
                    borderColor: theme.error,
                    backgroundColor: `${theme.error}08`,
                  },
                }}
              >
                View All ({vitals.length})
              </Button>
            )}
            <Button
              variant="contained"
              onClick={() => navigate("/add-vitals")}
              startIcon={<HealthAndSafety />}
              sx={{
                background: `linear-gradient(135deg, ${theme.error}, ${theme.warning})`,
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${theme.error}40`,
                },
              }}
            >
              Add Vitals
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {vitals.length > 0 ? (
            vitals.slice(0, 2).map((vital, index) => {
              const bpStatus = getBPStatus(
                vital.data.bloodPressure?.systolic,
                vital.data.bloodPressure?.diastolic
              );
              const hrStatus = getHRStatus(vital.data.heartRate);
              const tempStatus = getTempStatus(vital.data.temperature);

              return (
                <Grid item xs={12} md={6} key={index}>
                  <Card
                    sx={{
                      border: `1px solid ${theme.error}20`,
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: `0 4px 15px ${theme.error}20`,
                      },
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 2,
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarToday
                            sx={{
                              fontSize: 16,
                              mr: 1,
                              color: "text.secondary",
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", fontWeight: 500 }}
                          >
                            {vital.data.date.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                        <Chip
                          label={getOverallStatus(
                            bpStatus,
                            hrStatus,
                            tempStatus
                          )}
                          size="small"
                          color={
                            getOverallStatus(bpStatus, hrStatus, tempStatus) ===
                            "Normal"
                              ? "success"
                              : getOverallStatus(
                                  bpStatus,
                                  hrStatus,
                                  tempStatus
                                ) === "Elevated"
                              ? "warning"
                              : "error"
                          }
                        />
                      </Box>

                      <Grid container spacing={2}>
                        {/* Blood Pressure */}
                        <Grid item xs={12}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              p: 2,
                              borderRadius: 2,
                              bgcolor: `${bpStatus.color}08`,
                              border: `1px solid ${bpStatus.color}20`,
                            }}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  display: "block",
                                }}
                              >
                                Blood Pressure
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{ fontWeight: 700, color: bpStatus.color }}
                              >
                                {vital.data.bloodPressure?.systolic || "-"}/
                                {vital.data.bloodPressure?.diastolic || "-"}
                                <Typography
                                  component="span"
                                  variant="body2"
                                  sx={{ color: "text.secondary", ml: 0.5 }}
                                >
                                  mmHg
                                </Typography>
                              </Typography>
                            </Box>
                            <Chip
                              label={bpStatus.label}
                              size="small"
                              sx={{
                                bgcolor: `${bpStatus.color}20`,
                                color: bpStatus.color,
                                fontWeight: 600,
                              }}
                            />
                          </Box>
                        </Grid>

                        {/* Other Metrics */}
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 1 }}>
                            <Favorite
                              sx={{
                                fontSize: 20,
                                color: hrStatus.color,
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary", display: "block" }}
                            >
                              Heart Rate
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: hrStatus.color }}
                            >
                              {vital.data.heartRate || "-"}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ color: "text.secondary", ml: 0.5 }}
                              >
                                bpm
                              </Typography>
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={6}>
                          <Box sx={{ textAlign: "center", p: 1 }}>
                            <Thermostat
                              sx={{
                                fontSize: 20,
                                color: tempStatus.color,
                                mb: 0.5,
                              }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "text.secondary", display: "block" }}
                            >
                              Temperature
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, color: tempStatus.color }}
                            >
                              {vital.data.temperature || "-"}
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ color: "text.secondary", ml: 0.5 }}
                              >
                                °C
                              </Typography>
                            </Typography>
                          </Box>
                        </Grid>

                        {/* Additional Metrics */}
                        {(vital.data.bloodSugar || vital.data.weight) && (
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={1}>
                              {vital.data.bloodSugar && (
                                <Grid item xs={6}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      display: "block",
                                    }}
                                  >
                                    Blood Sugar
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {vital.data.bloodSugar} mg/dL
                                  </Typography>
                                </Grid>
                              )}
                              {vital.data.weight && (
                                <Grid item xs={6}>
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "text.secondary",
                                      display: "block",
                                    }}
                                  >
                                    Weight
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {vital.data.weight} kg
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </Grid>
                        )}

                        {vital.data.notes && (
                          <Grid item xs={12}>
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: "grey.50",
                                border: "1px solid",
                                borderColor: "grey.200",
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "text.secondary",
                                  display: "block",
                                  fontWeight: 600,
                                }}
                              >
                                Notes
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontStyle: "italic" }}
                              >
                                {vital.data.notes}
                              </Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Favorite
                  sx={{
                    fontSize: 48,
                    color: "text.secondary",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No vitals recorded yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Start tracking your health metrics to monitor your wellbeing
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/add-vitals")}
                  startIcon={<HealthAndSafety />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.error}, ${theme.warning})`,
                  }}
                >
                  Record First Vitals
                </Button>
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
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: `linear-gradient(180deg, ${theme.secondary}, ${theme.primary})`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                mb: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Insights sx={{ mr: 1, color: theme.secondary }} />
              AI Health Insights
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Intelligent analysis of your health data and trends
            </Typography>
          </Box>
          {insights.length > 2 && (
            <Button
              variant="outlined"
              onClick={() => navigate("/all-insights")}
              endIcon={<ArrowForward />}
              sx={{
                borderColor: theme.secondary,
                color: theme.secondary,
                borderRadius: 3,
                px: 3,
                fontWeight: 600,
                "&:hover": {
                  borderColor: theme.secondary,
                  backgroundColor: `${theme.secondary}08`,
                },
              }}
            >
              View All ({insights.length})
            </Button>
          )}
        </Box>

        <Grid container spacing={3}>
          {insights.length > 0 ? (
            insights.slice(0, 2).map((insight, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    border: `1px solid ${getSeverityColor(
                      insight.data.severity
                    )}30`,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${getSeverityColor(
                      insight.data.severity
                    )}08, #ffffff)`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 15px ${getSeverityColor(
                        insight.data.severity
                      )}20`,
                    },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Chip
                        label={insight.data.severity?.toUpperCase() || "INFO"}
                        size="small"
                        sx={{
                          bgcolor: `${getSeverityColor(
                            insight.data.severity
                          )}20`,
                          color: getSeverityColor(insight.data.severity),
                          fontWeight: 600,
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {insight.data.createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                    </Box>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "text.primary",
                        lineHeight: 1.6,
                        fontWeight: 500,
                        mb: 1,
                      }}
                    >
                      {insight.data.fileAnalysis?.title || "Health Analysis"}
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        lineHeight: 1.6,
                        opacity: 0.9,
                      }}
                    >
                      {insight.data.fileAnalysis?.summary?.substring(0, 150) ||
                        "No summary available"}
                      {insight.data.fileAnalysis?.summary?.length > 150 &&
                        "..."}
                    </Typography>

                    {/* Associated Report */}
                    {insight.data.associatedReport && (
                      <Box
                        sx={{
                          mt: 2,
                          pt: 2,
                          borderTop: `1px solid ${getSeverityColor(
                            insight.data.severity
                          )}15`,
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Description sx={{ fontSize: 14, mr: 0.5 }} />
                          From: {insight.data.associatedReport}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Insights
                  sx={{
                    fontSize: 48,
                    color: "text.secondary",
                    mb: 2,
                    opacity: 0.5,
                  }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No AI insights yet
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Upload medical reports to generate AI-powered health insights
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate("/upload-report")}
                  startIcon={<UploadFile />}
                  sx={{
                    background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
                  }}
                >
                  Upload Report
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>
      {/* AI Chat Floating Button */}
      {!showAIChat && (
        <Fade in={!showAIChat}>
          <Button
            variant="contained"
            startIcon={<SmartToy />}
            onClick={() => setShowAIChat(true)}
            sx={{
              position: "fixed",
              bottom: 20,
              right: 20,
              borderRadius: 10,
              px: 3,
              py: 1.5,
              fontWeight: 600,
              background: `linear-gradient(135deg, ${theme.secondary}, ${theme.primary})`,
              boxShadow: `0 8px 25px ${theme.secondary}40`,
              zIndex: 9998,
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: `0 12px 30px ${theme.secondary}60`,
              },
            }}
          >
            AI Health Assistant
          </Button>
        </Fade>
      )}

      {/* AI Chat Component */}
      {showAIChat && (
        <AIChat context="dashboard" onClose={() => setShowAIChat(false)} />
      )}
    </Container>
  );
};

export default Dashboard;
