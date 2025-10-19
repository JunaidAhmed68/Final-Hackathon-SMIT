import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const ViewReport = () => {
  const { id } = useParams(); // this is fileId
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [aiInsight, setAiInsight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          toast.error("Please login first!");
          navigate("/login");
          return;
        }

        const res = await axios.get("http://localhost:3000/ai/timeline", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const timeline = res.data.data;

        // Find this specific file report
        const reportData = timeline.find(
          (item) => item.type === "file" && item.data._id === id
        );
        setReport(reportData?.data || null);

        // Find related AI Insight
        const insightData = timeline.find(
          (item) =>
            item.type === "insight" &&
            item.data.fileId &&
            item.data.fileId._id === id
        );
        setAiInsight(insightData?.data?.fileAnalysis || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch report data");
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [id, navigate]);

  if (loading) return <Typography align="center">Loading...</Typography>;

  if (!report)
    return (
      <Typography align="center" sx={{ mt: 4 }}>
        Report not found.
      </Typography>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          View Report
        </Typography>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          <strong>Report Name:</strong> {report.originalName}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {aiInsight ? (
          <>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Summary / AI Insights:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {aiInsight.summary || "No summary available"}
            </Typography>

            <Typography variant="h6" sx={{ mt: 3 }}>
              Urdu Summary:
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {aiInsight.urduSummary || "Roman Urdu summary not available"}
            </Typography>

            {aiInsight.keyFindings?.length > 0 && (
              <>
                <Typography variant="h6">Key Findings:</Typography>
                <List dense>
                  {aiInsight.keyFindings.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${item}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {aiInsight.doctorQuestions?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Questions to Ask Doctor:
                </Typography>
                <List dense>
                  {aiInsight.doctorQuestions.map((q, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${q}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {aiInsight.foodSuggestions && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Food Suggestions:
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Avoid:</strong>{" "}
                  {aiInsight.foodSuggestions.avoid?.join(", ") || "None"}
                </Typography>
                <Typography variant="body2">
                  <strong>Recommended:</strong>{" "}
                  {aiInsight.foodSuggestions.recommended?.join(", ") || "None"}
                </Typography>
              </>
            )}

            {aiInsight.homeRemedies?.length > 0 && (
              <>
                <Typography variant="h6" sx={{ mt: 3 }}>
                  Home Remedies:
                </Typography>
                <List dense>
                  {aiInsight.homeRemedies.map((r, i) => (
                    <ListItem key={i}>
                      <ListItemText primary={`• ${r}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {aiInsight.friendlyNote && (
              <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic" }}>
                🩺 {aiInsight.friendlyNote}
              </Typography>
            )}
          </>
        ) : (
          <Typography color="text.secondary">
            No AI summary available for this report.
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 3 }}
        >
          Back
        </Button>
      </Paper>
    </Container>
  );
};

export default ViewReport;