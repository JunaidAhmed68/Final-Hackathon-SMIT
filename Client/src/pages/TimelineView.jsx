import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Paper,
} from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const TimelineView = () => {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const token = Cookies.get("token"); // ✅ use cookie for auth
        if (!token) {
          toast.error("Please log in to view your timeline.");
          return;
        }

        const res = await axios.get("http://localhost:3000/ai/timeline", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const timelineData = res.data.data.map((item) => ({
          ...item,
          // ✅ Safely convert dates
          date: item.date ? new Date(item.date) : new Date(),
        }));

        setTimeline(timelineData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch timeline data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  if (loading)
    return (
      <Box className="flex justify-center items-center h-screen">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Timeline
      </Typography>

      {timeline.length === 0 ? (
        <Typography color="text.secondary" sx={{ mt: 3 }}>
          No activity yet.
        </Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {timeline.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight={600}>
                        {`${item.date.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })} — ${item.type.toUpperCase()}`}
                      </Typography>
                    }
                    secondary={
                      item.data?.fileAnalysis?.summary ||
                      item.data?.notes ||
                      "No details available."
                    }
                  />
                </ListItem>
                {index < timeline.length - 1 && <Divider variant="middle" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default TimelineView;