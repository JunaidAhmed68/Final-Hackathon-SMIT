import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const TimelineView = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/ai/timeline', { headers: { Authorization: `Bearer ${token}` } });
        setTimeline(res.data.data);
      } catch (err) {
        toast.error('Failed to fetch timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Timeline</Typography>
      <List>
        {timeline.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${item.date.toLocaleDateString()} - ${item.type}`} secondary={item.data.fileAnalysis?.summary || item.data.notes || 'No details'} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TimelineView;