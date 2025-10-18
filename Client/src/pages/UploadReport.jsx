import React, { useState } from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const handleUpload = async () => {
    if (!file) return toast.error('Please select a file');
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/ai/analyze-file', formData, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      toast.success('Report analyzed successfully');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Upload Report</Typography>
      <Box sx={{ mt: 2 }}>
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-input" />
        <label htmlFor="file-input">
          <Button variant="contained" component="span">Select File</Button>
        </label>
        {file && <Button variant="contained" onClick={handleUpload} disabled={loading} sx={{ ml: 2 }}>Upload</Button>}
        {loading && <Typography>Analyzing...</Typography>}
      </Box>
    </Container>
  );
};

export default UploadReport;