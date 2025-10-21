import React, { useState, useEffect } from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  ToggleButton,
  ToggleButtonGroup,
  CircularProgress,
} from '@mui/material';
import {
  Favorite,
  ArrowBack,
  Search,
  FilterList,
  CalendarToday,
  Thermostat,
  MonitorHeart,
  Bloodtype,
  Scale,
  TrendingUp,
  TableChart,
  GridView,
  Download,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie";
import { toast } from 'react-toastify';

const AllVitals = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState([]);
  const [filteredVitals, setFilteredVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [dateSort, setDateSort] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchAllVitals = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get('http://localhost:3000/ai/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const allVitals = res.data.data
          .filter(item => item.type === 'vitals')
          .map(item => ({
            ...item,
            data: { 
              ...item.data, 
              date: new Date(item.data.date),
            },
          }))
          .sort((a, b) => b.data.date - a.data.date);

        setVitals(allVitals);
        setFilteredVitals(allVitals);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch vitals');
      } finally {
        setLoading(false);
      }
    };
    fetchAllVitals();
  }, []);

  const getBPStatus = (systolic, diastolic) => {
    if (!systolic || !diastolic) return { label: 'No data', color: '#6b7280' };
    
    if (systolic < 90 || diastolic < 60) return { label: 'Low', color: '#3b82f6' };
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: '#10b981' };
    if (systolic < 130 && diastolic < 80) return { label: 'Elevated', color: '#f59e0b' };
    if (systolic < 140 || diastolic < 90) return { label: 'High Stage 1', color: '#f59e0b' };
    return { label: 'High Stage 2', color: '#ef4444' };
  };

  const getHRStatus = (heartRate) => {
    if (!heartRate) return { label: 'No data', color: '#6b7280' };
    
    if (heartRate < 60) return { label: 'Low', color: '#3b82f6' };
    if (heartRate <= 100) return { label: 'Normal', color: '#10b981' };
    return { label: 'High', color: '#ef4444' };
  };

  const getTempStatus = (temperature) => {
    if (!temperature) return { label: 'No data', color: '#6b7280' };
    
    if (temperature < 36.1) return { label: 'Low', color: '#3b82f6' };
    if (temperature <= 37.2) return { label: 'Normal', color: '#10b981' };
    return { label: 'High', color: '#ef4444' };
  };

  const getOverallStatus = (bpStatus, hrStatus, tempStatus) => {
    const statuses = [bpStatus, hrStatus, tempStatus];
    if (statuses.some(s => s.color === '#ef4444')) return 'Critical';
    if (statuses.some(s => s.color === '#f59e0b')) return 'Elevated';
    return 'Normal';
  };

  useEffect(() => {
    let filtered = [...vitals];

    // Apply sorting
    filtered.sort((a, b) => {
      if (dateSort === 'newest') {
        return b.data.date - a.data.date;
      } else {
        return a.data.date - b.data.date;
      }
    });

    setFilteredVitals(filtered);
    setPage(0); // Reset to first page when filters change
  }, [dateSort, vitals]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleDateSort = (sort) => {
    setDateSort(sort);
    handleFilterClose();
  };

  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadVitals = () => {
    const csvContent = [
      ['Date', 'Systolic', 'Diastolic', 'Heart Rate', 'Temperature', 'Blood Sugar', 'Weight', 'Notes'],
      ...filteredVitals.map(vital => [
        vital.data.date.toLocaleDateString(),
        vital.data.bloodPressure?.systolic || '',
        vital.data.bloodPressure?.diastolic || '',
        vital.data.heartRate || '',
        vital.data.temperature || '',
        vital.data.bloodSugar || '',
        vital.data.weight || '',
        vital.data.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vitals-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.success('Vitals exported successfully!');
  };

  const paginatedVitals = filteredVitals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
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
          onClick={() => navigate('/')}
          sx={{ mb: 2, color: 'primary.main' }}
        >
          Back to Dashboard
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              Health Vitals History
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {filteredVitals.length} recording{filteredVitals.length !== 1 ? 's' : ''} found
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/add-vitals')}
            startIcon={<Add />}
            sx={{
              background: `linear-gradient(135deg, #ef4444, #f59e0b)`,
              borderRadius: 3,
              px: 3,
              fontWeight: 600,
            }}
          >
            Add New Vitals
          </Button>
        </Box>
      </Box>

      {/* Search and Controls */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search vitals by notes..."
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
          <Grid item xs={6} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{ height: '56px' }}
            >
              Sort
            </Button>
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleDateSort('newest')}>
                <ListItemText>Newest First</ListItemText>
                {dateSort === 'newest' && '✓'}
              </MenuItem>
              <MenuItem onClick={() => handleDateSort('oldest')}>
                <ListItemText>Oldest First</ListItemText>
                {dateSort === 'oldest' && '✓'}
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={6} md={2}>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              fullWidth
              sx={{ height: '56px' }}
            >
              <ToggleButton value="grid" sx={{ py: 1.5 }}>
                <GridView />
              </ToggleButton>
              <ToggleButton value="table" sx={{ py: 1.5 }}>
                <TableChart />
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadVitals}
              sx={{ height: '56px' }}
            >
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <Grid container spacing={3}>
          {paginatedVitals.length > 0 ? (
            paginatedVitals.map((vital, index) => {
              const bpStatus = getBPStatus(vital.data.bloodPressure?.systolic, vital.data.bloodPressure?.diastolic);
              const hrStatus = getHRStatus(vital.data.heartRate);
              const tempStatus = getTempStatus(vital.data.temperature);
              
              return (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <Card sx={{ height: '100%', transition: 'all 0.3s ease' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <CalendarToday sx={{ fontSize: 16, mr: 1, color: "text.secondary" }} />
                          <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                            {vital.data.date.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </Typography>
                        </Box>
                        <Chip 
                          label={getOverallStatus(bpStatus, hrStatus, tempStatus)} 
                          size="small"
                          color={
                            getOverallStatus(bpStatus, hrStatus, tempStatus) === 'Normal' ? 'success' :
                            getOverallStatus(bpStatus, hrStatus, tempStatus) === 'Elevated' ? 'warning' : 'error'
                          }
                        />
                      </Box>

                      {/* Blood Pressure */}
                      <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: `${bpStatus.color}08` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <MonitorHeart sx={{ fontSize: 20, color: bpStatus.color, mr: 1 }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Blood Pressure
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: bpStatus.color }}>
                          {vital.data.bloodPressure?.systolic || "-"}/
                          {vital.data.bloodPressure?.diastolic || "-"} mmHg
                        </Typography>
                        <Chip 
                          label={bpStatus.label} 
                          size="small"
                          sx={{ mt: 1, bgcolor: `${bpStatus.color}20`, color: bpStatus.color }}
                        />
                      </Box>

                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Favorite sx={{ fontSize: 20, color: hrStatus.color, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Heart Rate
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: hrStatus.color }}>
                              {vital.data.heartRate || "-"} bpm
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ textAlign: 'center', p: 1 }}>
                            <Thermostat sx={{ fontSize: 20, color: tempStatus.color, mb: 0.5 }} />
                            <Typography variant="caption" sx={{ color: "text.secondary" }}>
                              Temperature
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: tempStatus.color }}>
                              {vital.data.temperature || "-"} °C
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      {(vital.data.bloodSugar || vital.data.weight) && (
                        <Divider sx={{ my: 1 }} />
                      )}

                      <Grid container spacing={1}>
                        {vital.data.bloodSugar && (
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Bloodtype sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                Blood Sugar
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {vital.data.bloodSugar} mg/dL
                            </Typography>
                          </Grid>
                        )}
                        {vital.data.weight && (
                          <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Scale sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                Weight
                              </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {vital.data.weight} kg
                            </Typography>
                          </Grid>
                        )}
                      </Grid>

                      {vital.data.notes && (
                        <>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                            Notes
                          </Typography>
                          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                            {vital.data.notes}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Favorite sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No vitals found
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {searchTerm ? 'Try adjusting your search terms' : 'Start recording your vitals to track your health'}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/add-vitals')}
                  startIcon={<Add />}
                >
                  Record Vitals
                </Button>
              </Box>
            </Grid>
          )}
        </Grid>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Blood Pressure</TableCell>
                  <TableCell>Heart Rate</TableCell>
                  <TableCell>Temperature</TableCell>
                  <TableCell>Blood Sugar</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedVitals.map((vital, index) => {
                  const bpStatus = getBPStatus(vital.data.bloodPressure?.systolic, vital.data.bloodPressure?.diastolic);
                  const hrStatus = getHRStatus(vital.data.heartRate);
                  const tempStatus = getTempStatus(vital.data.temperature);
                  
                  return (
                    <TableRow key={index} hover>
                      <TableCell>
                        {vital.data.date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: bpStatus.color,
                            mr: 1 
                          }} />
                          {vital.data.bloodPressure?.systolic || "-"}/
                          {vital.data.bloodPressure?.diastolic || "-"} mmHg
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: hrStatus.color,
                            mr: 1 
                          }} />
                          {vital.data.heartRate || "-"} bpm
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            bgcolor: tempStatus.color,
                            mr: 1 
                          }} />
                          {vital.data.temperature || "-"} °C
                        </Box>
                      </TableCell>
                      <TableCell>{vital.data.bloodSugar || "-"}</TableCell>
                      <TableCell>{vital.data.weight || "-"}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getOverallStatus(bpStatus, hrStatus, tempStatus)} 
                          size="small"
                          color={
                            getOverallStatus(bpStatus, hrStatus, tempStatus) === 'Normal' ? 'success' :
                            getOverallStatus(bpStatus, hrStatus, tempStatus) === 'Elevated' ? 'warning' : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredVitals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      )}

      {/* Pagination for Grid View */}
      {viewMode === 'grid' && filteredVitals.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <TablePagination
            rowsPerPageOptions={[6, 12, 24]}
            component="div"
            count={filteredVitals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}
    </Container>
  );
};

export default AllVitals;