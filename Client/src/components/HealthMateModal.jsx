import React, { useState, useRef, useContext } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Tab, Tabs } from '@mui/material';
import { Close, Upload, TextFields, Timeline } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const HealthMateModal = ({ open, onClose }) => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [analysis, setAnalysis] = useState(null);
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
      setAnalysis(res.data.data);
      toast.success('Analysis complete');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>HealthMate AI Assistant <IconButton onClick={onClose} sx={{ float: 'right' }}><Close /></IconButton></DialogTitle>
      <DialogContent>
        <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
          <Tab icon={<Upload />} label="Upload Report" />
          <Tab icon={<TextFields />} label="Text Input" />
          <Tab icon={<Timeline />} label="Timeline" />
        </Tabs>
        {activeTab === 0 && (
          <Box sx={{ p: 2 }}>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            <Button variant="contained" onClick={() => fileInputRef.current.click()} sx={{ mb: 2 }}>Select File</Button>
            {file && <Button variant="contained" onClick={handleUpload} disabled={loading}>Analyze</Button>}
            {loading && <Typography>Analyzing...</Typography>}
            {analysis && <Typography>{analysis.summary}</Typography>}
          </Box>
        )}
      </DialogContent>
      <DialogActions><Button onClick={onClose}>Close</Button></DialogActions>
    </Dialog>
  );
};

export default HealthMateModal;