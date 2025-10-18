import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Divider 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

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

        // Separate timeline data and convert string dates to Date objects
        setReports(
          data
            .filter(item => item.type === 'file')
            .map(item => ({
              ...item,
              data: { ...item.data, uploadDate: new Date(item.data.uploadDate) },
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
              data: { ...item.data, createdAt: new Date(item.data.createdAt) },
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

  if (loading) return <Typography align="center" sx={{ mt: 4 }}>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Reports Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Uploaded Reports
        </Typography>
        <List>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <ListItem
                key={index}
                button
                onClick={() => navigate(`/view-report/${report.data._id}`)}
              >
                <ListItemText
                  primary={report.data.originalName}
                  secondary={`Uploaded on ${report.data.uploadDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No reports uploaded yet.
            </Typography>
          )}
        </List>
        <Button
          variant="contained"
          onClick={() => navigate('/upload-report')}
          sx={{ mt: 2 }}
        >
          Upload New Report
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Vitals Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Vitals
        </Typography>
        <List>
          {vitals.length > 0 ? (
            vitals.map((vital, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Recorded on ${vital.data.date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                  secondary={`BP: ${vital.data.bloodPressure?.systolic || '-'} / ${
                    vital.data.bloodPressure?.diastolic || '-'
                  }, HR: ${vital.data.heartRate || '-'} bpm, Temp: ${
                    vital.data.temperature || '-'
                  }°C`}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No vitals recorded yet.
            </Typography>
          )}
        </List>
        <Button
          variant="contained"
          onClick={() => navigate('/add-vitals')}
          sx={{ mt: 2 }}
        >
          Add New Vitals
        </Button>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* AI Insights Section */}
      <Box>
        <Typography variant="h6" sx={{ mb: 1 }}>
          AI Insights
        </Typography>
        <List>
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Insight generated on ${insight.data.createdAt.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}`}
                  secondary={insight.data.fileAnalysis?.summary || 'No summary available'}
                />
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ p: 2 }}>
              No AI insights yet.
            </Typography>
          )}
        </List>
      </Box>
    </Container>
  );
};

export default Dashboard;
