import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const UploadReport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null); // 🧠 store AI analysis

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setAnalysis(null); // reset old result
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/ai/analyze-file",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Report analyzed successfully ✅");
      setAnalysis(res.data.data); // store analysis response
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Upload & Analyze Report
        </Typography>

        {/* Upload Section */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="contained" component="span">
              Select File
            </Button>
          </label>

          {file && (
            <Button
              variant="contained"
              color="success"
              onClick={handleUpload}
              disabled={loading}
              sx={{ ml: 2 }}
            >
              {loading ? "Analyzing..." : "Upload & Analyze"}
            </Button>
          )}
        </Box>

        {/* Analysis Result */}
        {analysis && (
          <Box sx={{ mt: 4 }}>
            <Divider sx={{ mb: 3 }} />
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "primary.main" }}
            >
              AI Analysis Result 🧠
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Summary:</strong> {analysis.summary || "No summary available"}
            </Typography>

            {analysis.urduSummary && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Urdu Summary:</strong> {analysis.urduSummary}
              </Typography>
            )}

            {analysis.keyFindings?.length > 0 && (
              <>
                <Typography variant="h6">Key Findings:</Typography>
                <List dense>
                  {analysis.keyFindings.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${item}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {analysis.abnormalValues?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Abnormal Values:
                </Typography>
                <List dense>
                  {analysis.abnormalValues.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`⚠️ ${item}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {analysis.doctorQuestions?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Questions to Ask Doctor:
                </Typography>
                <List dense>
                  {analysis.doctorQuestions.map((q, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${q}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {analysis.foodSuggestions && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Food Suggestions:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Avoid:</strong>{" "}
                  {analysis.foodSuggestions.avoid?.join(", ") || "None"}
                </Typography>
                <Typography variant="body2">
                  <strong>Recommended:</strong>{" "}
                  {analysis.foodSuggestions.recommended?.join(", ") || "None"}
                </Typography>
              </>
            )}

            {analysis.homeRemedies?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Home Remedies:
                </Typography>
                <List dense>
                  {analysis.homeRemedies.map((r, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${r}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {analysis.friendlyNote && (
              <Typography
                variant="body2"
                sx={{ mt: 3, fontStyle: "italic", color: "text.secondary" }}
              >
                🩺 {analysis.friendlyNote}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default UploadReport;
