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
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Description,
  CalendarToday,
  Search,
  ArrowBack,
  Download,
  Visibility,
  FilterList,
  PictureAsPdf,
  InsertDriveFile,
  Image,
  Sort,
  GetApp,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie"
import { toast } from 'react-toastify';

const AllReports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [sortAnchor, setSortAnchor] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadDialog, setDownloadDialog] = useState(null);

  // Filter and sort states
  const [fileTypeFilter, setFileTypeFilter] = useState('all');
  const [dateSort, setDateSort] = useState('newest');

  useEffect(() => {
    const fetchAllReports = async () => {
      try {
        const token = Cookies.get("token");
        const res = await axios.get('https://final-hackathon-smit-eight.vercel.app/ai/timeline', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const allReports = res.data.data
          .filter(item => item.type === 'file')
          .map(item => ({
            ...item,
            data: { 
              ...item.data, 
              uploadDate: new Date(item.data.uploadDate),
              fileType: getFileType(item.data.originalName),
            },
          }));

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

  // Get file type
  const getFileType = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'document';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) return 'image';
    return 'other';
  };

  const getFileTypeColor = (fileName) => {
    const fileType = getFileType(fileName);
    switch (fileType) {
      case 'pdf': return '#ff4444';
      case 'document': return '#2d87f0';
      case 'image': return '#00c851';
      default: return '#ff8800';
    }
  };

  const getFileTypeLabel = (fileName) => {
    const fileType = getFileType(fileName);
    switch (fileType) {
      case 'pdf': return 'PDF';
      case 'document': return 'DOC';
      case 'image': return 'IMAGE';
      default: return 'FILE';
    }
  };

  const getFileTypeIcon = (fileName) => {
    const fileType = getFileType(fileName);
    switch (fileType) {
      case 'pdf': return <PictureAsPdf />;
      case 'document': return <InsertDriveFile />;
      case 'image': return <Image />;
      default: return <Description />;
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...reports];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.data.originalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply file type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(report => 
        getFileType(report.data.originalName) === fileTypeFilter
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (dateSort === 'newest') {
        return b.data.uploadDate - a.data.uploadDate;
      } else {
        return a.data.uploadDate - b.data.uploadDate;
      }
    });

    setFilteredReports(filtered);
  }, [searchTerm, fileTypeFilter, dateSort, reports]);

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

  const handleFileTypeFilter = (type) => {
    setFileTypeFilter(type);
    handleFilterClose();
  };

  const handleDateSort = (sort) => {
    setDateSort(sort);
    handleSortClose();
  };

  const clearFilters = () => {
    setFileTypeFilter('all');
    setDateSort('newest');
    setSearchTerm('');
  };

  // Download functionality
  const handleDownload = async (report) => {
    setDownloadingId(report.data._id);
    try {
      const token = Cookies.get("token");
      
      // If the report has a fileUrl, download directly
      if (report.data.fileUrl) {
        const response = await axios.get(report.data.fileUrl, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        });

        // Create blob and download
        const blob = new Blob([response.data]);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = report.data.originalName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Report downloaded successfully!');
      } else {
        // If no fileUrl, show dialog with alternative options
        setDownloadDialog(report);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleViewInBrowser = (report) => {
    if (report.data.fileUrl) {
      window.open(report.data.fileUrl, '_blank');
    } else {
      toast.error('No file URL available');
    }
    setDownloadDialog(null);
  };

  const handleCloseDownloadDialog = () => {
    setDownloadDialog(null);
  };

  const activeFiltersCount = (fileTypeFilter !== 'all' ? 1 : 0) + (searchTerm ? 1 : 0);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
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
        
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
          All Medical Reports
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary' }}>
          {filteredReports.length} report{filteredReports.length !== 1 ? 's' : ''} found
          {activeFiltersCount > 0 && ` • ${activeFiltersCount} filter${activeFiltersCount !== 1 ? 's' : ''} active`}
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
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
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={handleFilterClick}
              sx={{ height: '56px' }}
            >
              Filter {fileTypeFilter !== 'all' && '•'}
            </Button>
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={handleFilterClose}
            >
              <MenuItem onClick={() => handleFileTypeFilter('all')}>
                <ListItemText>All File Types</ListItemText>
                {fileTypeFilter === 'all' && '✓'}
              </MenuItem>
              <MenuItem onClick={() => handleFileTypeFilter('pdf')}>
                <ListItemIcon><PictureAsPdf /></ListItemIcon>
                <ListItemText>PDF Files</ListItemText>
                {fileTypeFilter === 'pdf' && '✓'}
              </MenuItem>
              <MenuItem onClick={() => handleFileTypeFilter('document')}>
                <ListItemIcon><InsertDriveFile /></ListItemIcon>
                <ListItemText>Document Files</ListItemText>
                {fileTypeFilter === 'document' && '✓'}
              </MenuItem>
              <MenuItem onClick={() => handleFileTypeFilter('image')}>
                <ListItemIcon><Image /></ListItemIcon>
                <ListItemText>Image Files</ListItemText>
                {fileTypeFilter === 'image' && '✓'}
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Sort />}
              onClick={handleSortClick}
              sx={{ height: '56px' }}
            >
              Sort
            </Button>
            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={handleSortClose}
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
        </Grid>
        
        {/* Active filters display */}
        {(fileTypeFilter !== 'all' || searchTerm) && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {fileTypeFilter !== 'all' && (
              <Chip 
                label={`Type: ${fileTypeFilter}`} 
                size="small" 
                onDelete={() => setFileTypeFilter('all')}
              />
            )}
            {searchTerm && (
              <Chip 
                label={`Search: "${searchTerm}"`} 
                size="small" 
                onDelete={() => setSearchTerm('')}
              />
            )}
            <Button size="small" onClick={clearFilters}>
              Clear All
            </Button>
          </Box>
        )}
      </Paper>

      {/* Reports Grid */}
      <Grid container spacing={3}>
        {filteredReports.length > 0 ? (
          filteredReports.map((report, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
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
                      {getFileTypeIcon(report.data.originalName)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600, 
                          mb: 0.5,
                          wordBreak: 'break-word'
                        }}
                      >
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
                {searchTerm || fileTypeFilter !== 'all' ? 'Try adjusting your filters or search terms' : 'Upload your first medical report to get started'}
              </Typography>
              {(searchTerm || fileTypeFilter !== 'all') ? (
                <Button variant="outlined" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : (
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