// components/ReportView.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  SmartToy,
  Description,
  CalendarToday,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import AIChat from '../components/AIChat';

const ReportView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = Cookies.get('token');
        
        // Fetch report details
        const reportRes = await axios.get(`https://final-hackathon-smit-eight.vercel.app/ai/report/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setReport(reportRes.data.data);

        // Fetch AI insights for this report
        const insightsRes = await axios.get(`https://final-hackathon-smit-eight.vercel.app/ai/insights/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setInsights(insightsRes.data.data);
      } catch (error) {
        console.error('Error fetching report:', error);
        toast.error('Failed to load report details');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id]);

  const handleDownload = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`https://final-hackathon-smit-eight.vercel.app/ai/report/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = report.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Report downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download report');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        
      </Container>
    );
  }

  if (!report) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          Report not found. Please try again.
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
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
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {report.originalName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Uploaded {new Date(report.uploadDate).toLocaleDateString()}
                </Typography>
              </Box>
              <Chip 
                label={report.fileType?.toUpperCase() || 'FILE'} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<SmartToy />}
              onClick={() => setShowAIChat(true)}
            >
              Ask AI
            </Button>
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={handleDownload}
            >
              Download
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={4}>
        {/* Report Preview/Details */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <Description sx={{ mr: 1 }} />
              Report Content
            </Typography>
            
            {report.fileUrl ? (
              <Box sx={{ height: '600px', border: 1, borderColor: 'divider', borderRadius: 2 }}>
                <iframe
                  src={report.fileUrl}
                  title={report.originalName}
                  width="100%"
                  height="100%"
                  style={{ border: 'none', borderRadius: '8px' }}
                />
              </Box>
            ) : (
              <Alert severity="info">
                Report preview not available. You can download the file to view its contents.
              </Alert>
            )}
          </Paper>
        </Grid>

        {/* AI Insights Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 4, borderRadius: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h5" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <SmartToy sx={{ mr: 1 }} />
              AI Analysis
            </Typography>

            {insights ? (
              <Box>
                <Alert severity={insights.severity || 'info'} sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {insights.severity?.toUpperCase() || 'INFO'} PRIORITY
                  </Typography>
                </Alert>

                <Card sx={{ mb: 3, bgcolor: 'primary.50' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                      Summary
                    </Typography>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {insights.summary || 'No summary available.'}
                    </Typography>
                  </CardContent>
                </Card>

                {insights.keyFindings && insights.keyFindings.length > 0 && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Key Findings
                      </Typography>
                      {insights.keyFindings.map((finding, index) => (
                        <Box key={index} sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}>
                          <Chip 
                            label={finding.severity} 
                            size="small" 
                            color={
                              finding.severity === 'high' ? 'error' :
                              finding.severity === 'medium' ? 'warning' : 'success'
                            }
                            sx={{ mr: 1, minWidth: 60 }}
                          />
                          <Typography variant="body2">{finding.description}</Typography>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SmartToy />}
                  onClick={() => setShowAIChat(true)}
                  sx={{ mt: 2 }}
                >
                  Ask Questions About This Report
                </Button>
              </Box>
            ) : (
              <Alert severity="info">
                AI analysis not available for this report yet.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* AI Chat for Report */}
      {showAIChat && (
        <AIChat
          context="report"
          reportId={id}
          onClose={() => setShowAIChat(false)}
          position="fixed"
        />
      )}
    </Container>
  );
};

export default ReportView;