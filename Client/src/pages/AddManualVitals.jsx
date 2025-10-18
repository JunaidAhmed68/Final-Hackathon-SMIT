import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AddManualVitals = () => {
  const navigate = useNavigate();
  const [vitals, setVitals] = useState({
    systolic: "",
    diastolic: "",
    bloodSugar: "",
    weight: "",
    heartRate: "",
    temperature: "",
    notes: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVitals((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!vitals.systolic || !vitals.diastolic) {
      return toast.error("Please enter both systolic and diastolic BP values.");
    }

    setLoading(true);
    try {
      const token = Cookies.get("token"); // ✅ using cookie instead of localStorage
      if (!token) {
        toast.error("Please log in first!");
        return;
      }

      await axios.post(
        "http://localhost:3000/ai/add-vitals",
        {
          date: vitals.date ? new Date(vitals.date) : new Date(),
          bloodPressure: {
            systolic: Number(vitals.systolic),
            diastolic: Number(vitals.diastolic),
          },
          bloodSugar: vitals.bloodSugar ? Number(vitals.bloodSugar) : null,
          weight: vitals.weight ? Number(vitals.weight) : null,
          heartRate: vitals.heartRate ? Number(vitals.heartRate) : null,
          temperature: vitals.temperature ? Number(vitals.temperature) : null,
          notes: vitals.notes || "",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Vitals added successfully!");
      navigate("/"); // ✅ redirect to dashboard
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add vitals!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          Add Manual Vitals
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={vitals.date}
            onChange={handleChange}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Blood Pressure (Systolic)"
            name="systolic"
            value={vitals.systolic}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Blood Pressure (Diastolic)"
            name="diastolic"
            value={vitals.diastolic}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Blood Sugar (mg/dL)"
            name="bloodSugar"
            value={vitals.bloodSugar}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Weight (kg)"
            name="weight"
            value={vitals.weight}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Heart Rate (bpm)"
            name="heartRate"
            value={vitals.heartRate}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Temperature (°C)"
            name="temperature"
            value={vitals.temperature}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Notes"
            name="notes"
            value={vitals.notes}
            onChange={handleChange}
            sx={{ mb: 3 }}
            multiline
            rows={3}
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            disabled={loading}
            sx={{ py: 1.2, fontSize: "1rem" }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Save"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddManualVitals;
