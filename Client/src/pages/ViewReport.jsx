import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewReport = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/ai/timeline`, { headers: { Authorization: `Bearer ${token}` } });
        const reportData = res.data.data.find(item => item.data._id === id);
        setReport(reportData);
      } catch (err) {
        toast.error('Failed to fetch report');
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>View Report</Typography>
      {report && (
        <Box>
          <Typography>{report.data.fileAnalysis?.summary || 'No summary available'}</Typography>
          <Button variant="contained" onClick={() => window.history.back()} sx={{ mt: 2 }}>Back</Button>
        </Box>
      )}
    </Container>
  );
};

export default ViewReport;