import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import {
  Insights,
  ArrowBack,
  Search,
  FilterList,
  Warning,
  Info,
  Error,
  CheckCircle,
  CalendarToday,
  Description,
  Sort,
  Download,
  Share,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const AllInsights = () => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [filteredInsights, setFilteredInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateSort, setDateSort] = useState("newest");

  useEffect(() => {
    const fetchAllInsights = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get("http://localhost:3000/ai/timeline", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allInsights = res.data.data
          .filter((item) => item.type === "insight")
          .map((item) => ({
            ...item,
            data: {
              ...item.data,
              createdAt: new Date(item.data.createdAt),
              severity: item.data.severity || "info",
            },
          }))
          .sort((a, b) => b.data.createdAt - a.data.createdAt);

        setInsights(allInsights);
        setFilteredInsights(allInsights);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch insights");
      } finally {
        setLoading(false);
      }
    };
    fetchAllInsights();
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      case "info":
      default:
        return "#3b82f6";
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "high":
        return <Error />;
      case "medium":
        return <Warning />;
      case "low":
        return <CheckCircle />;
      case "info":
      default:
        return <Info />;
    }
  };

  useEffect(() => {
    let filtered = [...insights];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (insight) =>
          insight.data.fileAnalysis?.summary
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          insight.data.fileAnalysis?.title
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter(
        (insight) => insight.data.severity === severityFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (dateSort === "newest") {
        return b.data.createdAt - a.data.createdAt;
      } else {
        return a.data.createdAt - b.data.createdAt;
      }
    });

    setFilteredInsights(filtered);
  }, [searchTerm, severityFilter, dateSort, insights]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleSortClick = (event) => {
    setSortAnchor(event.currentTarget);
  };

  const handleSortClose = () => {
    setSortAnchor(null);
  };

  const handleSeverityFilter = (severity) => {
    setSeverityFilter(severity);
    handleFilterClose();
  };

  const handleDateSort = (sort) => {
    setDateSort(sort);
    handleSortClose();
  };

  const clearFilters = () => {
    setSeverityFilter("all");
    setDateSort("newest");
    setSearchTerm("");
  };

  const downloadInsight = (insight) => {
    // Create a downloadable text file with the insight
    const content = `
AI Health Insight
Generated: ${insight.data.createdAt.toLocaleDateString()}
Severity: ${insight.data.severity?.toUpperCase()}

${insight.data.fileAnalysis?.title || "Health Analysis"}

${insight.data.fileAnalysis?.summary || "No summary available"}

${
  insight.data.associatedReport
    ? `Associated Report: ${insight.data.associatedReport}`
    : ""
}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `health-insight-${
      insight.data.createdAt.toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success("Insight downloaded successfully!");
  };

  const activeFiltersCount =
    (severityFilter !== "all" ? 1 : 0) + (searchTerm ? 1 : 0);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mb: 2, color: "primary.main" }}
        >
          Back to Dashboard
        </Button>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          AI Health Insights
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary" }}>
          {filteredInsights.length} insight
          {filteredInsights.length !== 1 ? "s" : ""} found
          {activeFiltersCount > 0 &&
            ` • ${activeFiltersCount} filter${
              activeFiltersCount !== 1 ? "s" : ""
            } active`}
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search insights..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{ height: "56px" }}
            >
              Filter {severityFilter !== "all" && "•"}
            </Button>
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleSeverityFilter("all")}>
                <ListItemText>All Severities</ListItemText>
                {severityFilter === "all" && "✓"}
              </MenuItem>
              <MenuItem onClick={() => handleSeverityFilter("high")}>
                <ListItemIcon>
                  <Error sx={{ color: getSeverityColor("high") }} />
                </ListItemIcon>
                <ListItemText>High Priority</ListItemText>
                {severityFilter === "high" && "✓"}
              </MenuItem>
              <MenuItem onClick={() => handleSeverityFilter("medium")}>
                <ListItemIcon>
                  <Warning sx={{ color: getSeverityColor("medium") }} />
                </ListItemIcon>
                <ListItemText>Medium Priority</ListItemText>
                {severityFilter === "medium" && "✓"}
              </MenuItem>
              <MenuItem onClick={() => handleSeverityFilter("low")}>
                <ListItemIcon>
                  <CheckCircle sx={{ color: getSeverityColor("low") }} />
                </ListItemIcon>
                <ListItemText>Low Priority</ListItemText>
                {severityFilter === "low" && "✓"}
              </MenuItem>
              <MenuItem onClick={() => handleSeverityFilter("info")}>
                <ListItemIcon>
                  <Info sx={{ color: getSeverityColor("info") }} />
                </ListItemIcon>
                <ListItemText>Informational</ListItemText>
                {severityFilter === "info" && "✓"}
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Sort />}
              onClick={handleSortClick}
              sx={{ height: "56px" }}
            >
              Sort
            </Button>
            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={handleSortClose}
            >
              <MenuItem onClick={() => handleDateSort("newest")}>
                <ListItemText>Newest First</ListItemText>
                {dateSort === "newest" && "✓"}
              </MenuItem>
              <MenuItem onClick={() => handleDateSort("oldest")}>
                <ListItemText>Oldest First</ListItemText>
                {dateSort === "oldest" && "✓"}
              </MenuItem>
            </Menu>
          </Grid>
        </Grid>

        {/* Active filters display */}
        {(severityFilter !== "all" || searchTerm) && (
          <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {severityFilter !== "all" && (
              <Chip
                label={`Severity: ${severityFilter}`}
                size="small"
                onDelete={() => setSeverityFilter("all")}
                color={
                  severityFilter === "high"
                    ? "error"
                    : severityFilter === "medium"
                    ? "warning"
                    : severityFilter === "low"
                    ? "success"
                    : "info"
                }
              />
            )}
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                size="small"
                onDelete={() => setSearchTerm("")}
              />
            )}
            <Button size="small" onClick={clearFilters}>
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      {/* Insights Grid */}
      <Grid container spacing={3}>
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  border: `1px solid ${getSeverityColor(
                    insight.data.severity
                  )}30`,
                  background: `linear-gradient(135deg, ${getSeverityColor(
                    insight.data.severity
                  )}08, #ffffff)`,
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 4px 15px ${getSeverityColor(
                      insight.data.severity
                    )}20`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: `${getSeverityColor(insight.data.severity)}20`,
                        color: getSeverityColor(insight.data.severity),
                        mr: 2,
                      }}
                    >
                      {getSeverityIcon(insight.data.severity)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 1,
                        }}
                      >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {insight.data.fileAnalysis?.title ||
                            "Health Analysis"}
                        </Typography>
                        <Chip
                          label={insight.data.severity?.toUpperCase()}
                          size="small"
                          sx={{
                            bgcolor: `${getSeverityColor(
                              insight.data.severity
                            )}20`,
                            color: getSeverityColor(insight.data.severity),
                            fontWeight: 600,
                          }}
                        />
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                        />
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Generated{" "}
                          {insight.data.createdAt.toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.primary",
                      lineHeight: 1.6,
                      mb: 2,
                    }}
                  >
                    {insight.data.fileAnalysis?.summary ||
                      "No summary available"}
                  </Typography>

                  {insight.data.associatedReport && (
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Description
                        sx={{ fontSize: 16, mr: 1, color: "text.secondary" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        From report: {insight.data.associatedReport}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 2 }} />

                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      startIcon={<Download />}
                      onClick={() => downloadInsight(insight)}
                      size="small"
                    >
                      Download
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Insights
                sx={{
                  fontSize: 64,
                  color: "text.secondary",
                  mb: 2,
                  opacity: 0.5,
                }}
              />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No insights found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm || severityFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Upload medical reports to generate AI insights"}
              </Typography>
              {searchTerm || severityFilter !== "all" ? (
                <Button variant="outlined" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate("/upload-report")}
                  startIcon={<Description />}
                >
                  Upload Report
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default AllInsights;
