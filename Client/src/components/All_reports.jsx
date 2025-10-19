import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  Divider,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import {
  Description,
  CalendarToday,
  Search,
  ArrowBack,
  Download,
  Visibility,
  FilterList,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AllReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/ai/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const allReports = res.data.data
          .filter(item => item.type === 'file')
          .map(item => ({
            ...item,
            data: { 
              ...item.data, 
              uploadDate: new Date(item.data.uploadDate) 
            },
          }))
          .sort((a, b) => b.data.uploadDate - a.data.uploadDate);

        setReports(allReports);
        setFilteredReports(allReports);
      } catch (err) {
        console.error(err);
        toast.error('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, []);

  useEffect(() => {
    const filtered = reports.filter(report =>
      report.data.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filtered);
  }, [searchTerm, reports]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFileTypeColor = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return '#ff4444';
      case 'doc': case 'docx': return '#2d87f0';
      case 'jpg': case 'jpeg': case 'png': return '#00c851';
      default: return '#ff8800';
    }
  };

  const getFileTypeLabel = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    return ext ? ext.toUpperCase() : 'FILE';
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <Typography>Loading reports...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2, color: 'primary.main' }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          All Medical Reports
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {reports.length} report{reports.length !== 1 ? 's' : ''} found
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search reports by name..."
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
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ height: '56px' }}
            >
              Filter Reports
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Grid */}
      <Grid container spacing={3}>
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: `${getFileTypeColor(report.data.originalName)}20`,
                        color: getFileTypeColor(report.data.originalName),
                        mr: 2
                      }}
                    >
                      <Description />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {report.data.originalName}
                      </Typography>
                      <Chip 
                        label={getFileTypeLabel(report.data.originalName)}
                        size="small"
                        sx={{ 
                          bgcolor: `${getFileTypeColor(report.data.originalName)}20`,
                          color: getFileTypeColor(report.data.originalName)
                        }}
                      />
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Uploaded {report.data.uploadDate.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<Visibility />}
                      onClick={() => navigate(`/view-report/${report.data._id}`)}
                      sx={{ flex: 1 }}
                    >
                      View
                    </Button>
                    <IconButton 
                      sx={{ 
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <Download />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Description sx={{ fontSize: 64, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No reports found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first medical report to get started'}
              </Typography>
              {!searchTerm && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/upload-report')}
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

export default AllReports;