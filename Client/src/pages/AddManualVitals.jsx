import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddManualVitals = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
    bloodPressure: { systolic: '', diastolic: '' },
    bloodSugar: '',
    weight: '',
    heartRate: '',
    temperature: '',
    notes: '',
    date: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('bloodPressure')) {
      const [type] = name.split('.');
      setVitals(prev => ({
        ...prev,
        bloodPressure: { ...prev.bloodPressure, [type]: value }
      }));
    } else {
      setVitals(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/ai/add-vitals', {
        ...vitals,
        date: vitals.date ? new Date(vitals.date) : new Date(),
        bloodPressure: vitals.bloodPressure.systolic && vitals.bloodPressure.diastolic
          ? { systolic: Number(vitals.bloodPressure.systolic), diastolic: Number(vitals.bloodPressure.diastolic) }
          : null,
        bloodSugar: vitals.bloodSugar ? Number(vitals.bloodSugar) : null,
        weight: vitals.weight ? Number(vitals.weight) : null,
        heartRate: vitals.heartRate ? Number(vitals.heartRate) : null,
        temperature: vitals.temperature ? Number(vitals.temperature) : null,
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Vitals added successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to add vitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">Add Manual Vitals</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField fullWidth label="Date" type="date" name="date" value={vitals.date} onChange={handleChange} sx={{ mb: 2 }} InputLabelProps={{ shrink: true }} />
        <TextField fullWidth label="Blood Pressure (Systolic)" name="systolic" value={vitals.bloodPressure.systolic} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Blood Pressure (Diastolic)" name="diastolic" value={vitals.bloodPressure.diastolic} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Blood Sugar (mg/dL)" name="bloodSugar" value={vitals.bloodSugar} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Weight (kg)" name="weight" value={vitals.weight} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Heart Rate (bpm)" name="heartRate" value={vitals.heartRate} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Temperature (°C)" name="temperature" value={vitals.temperature} onChange={handleChange} sx={{ mb: 2 }} />
        <TextField fullWidth label="Notes" name="notes" value={vitals.notes} onChange={handleChange} sx={{ mb: 2 }} multiline rows={3} />
        <Button variant="contained" type="submit" fullWidth disabled={loading} sx={{ mt: 2 }}>Save Vitals</Button>
      </Box>
    </Container>
  );
};

export default AddManualVitals;