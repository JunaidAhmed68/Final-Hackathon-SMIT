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
  Chip,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Fade,
  Grid,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowBack,
  Upload,
  Description,
  Insights,
  SmartToy,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import AIChat from "../components/AIChat";
import TranslationButton from "../components/TranslationButton.jsx";

const theme = {
  primary: "#2563eb",
  secondary: "#7c3aed",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  background: "#f8fafc",
};

const UploadReport = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [showAIChat, setShowAIChat] = useState(false);
  const [translationLoading, setTranslationLoading] = useState(false);
  const [translatedData, setTranslatedData] = useState({
    summary: "",
    keyFindings: [],
    abnormalValues: [],
    doctorQuestions: [],
    homeRemedies: [],
    foodSuggestions: { recommended: [], avoid: [] },
    friendlyNote: ""
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
        "text/plain",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        toast.error("Please upload a PDF, image, or document file");
        return;
      }

      setFile(selectedFile);
      setAnalysis(null);
      setFileId(null);
      setTranslatedData({
        summary: "",
        keyFindings: [],
        abnormalValues: [],
        doctorQuestions: [],
        homeRemedies: [],
        foodSuggestions: { recommended: [], avoid: [] },
        friendlyNote: ""
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      };
      const token = getCookie("token");

      if (!token) {
        toast.error("Please log in to upload files");
        setLoading(false);
        navigate("/login");
        return;
      }

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
      
      toast.success("🎉 Report analyzed successfully!");
      setAnalysis(res.data.data);
      setFileId(res.data.fileId);
      
      // Translate all sections
      await translateAllSections(res.data.data);
      
    } catch (err) {
      console.error("Upload error:", err);
      const errorMessage =
        err.response?.data?.message || "Upload failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const translateAllSections = async (data) => {
    setTranslationLoading(true);
    
    try {
      const token = getCookie("token");
      
      // Translate summary
      if (data.summary) {
        const summaryResponse = await axios.post(
          "http://localhost:3000/translate/english-to-urdu",
          { text: data.summary },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (summaryResponse.data.success) {
          setTranslatedData(prev => ({
            ...prev,
            summary: summaryResponse.data.data.translatedText
          }));
        }
      }

      // Translate key findings
      if (data.keyFindings && data.keyFindings.length > 0) {
        const keyFindingsPromises = data.keyFindings.map(finding => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: finding },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const keyFindingsResults = await Promise.all(keyFindingsPromises);
        const translatedKeyFindings = keyFindingsResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );
        setTranslatedData(prev => ({
          ...prev,
          keyFindings: translatedKeyFindings
        }));
      }

      // Translate abnormal values
      if (data.abnormalValues && data.abnormalValues.length > 0) {
        const abnormalValuesPromises = data.abnormalValues.map(value => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: value },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const abnormalValuesResults = await Promise.all(abnormalValuesPromises);
        const translatedAbnormalValues = abnormalValuesResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );
        setTranslatedData(prev => ({
          ...prev,
          abnormalValues: translatedAbnormalValues
        }));
      }

      // Translate doctor questions
      if (data.doctorQuestions && data.doctorQuestions.length > 0) {
        const doctorQuestionsPromises = data.doctorQuestions.map(question => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: question },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const doctorQuestionsResults = await Promise.all(doctorQuestionsPromises);
        const translatedDoctorQuestions = doctorQuestionsResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );
        setTranslatedData(prev => ({
          ...prev,
          doctorQuestions: translatedDoctorQuestions
        }));
      }

      // Translate home remedies
      if (data.homeRemedies && data.homeRemedies.length > 0) {
        const homeRemediesPromises = data.homeRemedies.map(remedy => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: remedy },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        const homeRemediesResults = await Promise.all(homeRemediesPromises);
        const translatedHomeRemedies = homeRemediesResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );
        setTranslatedData(prev => ({
          ...prev,
          homeRemedies: translatedHomeRemedies
        }));
      }

      // Translate food suggestions
      if (data.foodSuggestions) {
        const recommendedPromises = data.foodSuggestions.recommended?.map(food => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: food },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ) || [];
        
        const avoidPromises = data.foodSuggestions.avoid?.map(food => 
          axios.post(
            "http://localhost:3000/translate/english-to-urdu",
            { text: food },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        ) || [];

        const [recommendedResults, avoidResults] = await Promise.all([
          Promise.all(recommendedPromises),
          Promise.all(avoidPromises)
        ]);

        const translatedRecommended = recommendedResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );
        const translatedAvoid = avoidResults.map(result => 
          result.data.success ? result.data.data.translatedText : result.config.data.text
        );

        setTranslatedData(prev => ({
          ...prev,
          foodSuggestions: {
            recommended: translatedRecommended,
            avoid: translatedAvoid
          }
        }));
      }

      // Translate friendly note
      if (data.friendlyNote) {
        const friendlyNoteResponse = await axios.post(
          "http://localhost:3000/translate/english-to-urdu",
          { text: data.friendlyNote },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (friendlyNoteResponse.data.success) {
          setTranslatedData(prev => ({
            ...prev,
            friendlyNote: friendlyNoteResponse.data.data.translatedText
          }));
        }
      }

    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Some translations failed");
    } finally {
      setTranslationLoading(false);
    }
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  };

  const fileName = file ? file.name : "No file selected";
  const fileSize = file ? `(${(file.size / 1024 / 1024).toFixed(2)} MB)` : "";

  const urduTextStyle = {
    lineHeight: 1.6,
    direction: "rtl",
    textAlign: "center",
    fontFamily: "'Noto Sans Arabic', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: "1.1rem",
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Centered Header */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/")}
          sx={{ mb: 2, color: "primary.main" }}
        >
          Back to Dashboard
        </Button>
      <Box sx={{ mb: 4, textAlign: "center" }}>

        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
          Upload Medical Report
        </Typography>
        <Typography variant="h6" sx={{ color: "text.secondary", textAlign: "center" }}>
          Get AI-powered analysis of your medical reports and lab results
        </Typography>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        {/* Upload Section - Centered */}
        <Grid item xs={12} md={8} lg={6}>
          <Paper sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
              <Upload sx={{ mr: 1 }} />
              Upload Report
            </Typography>

            <Box sx={{ textAlign: "center", mb: 3 }}>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.txt,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="file-input"
              />
              <label htmlFor="file-input">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Description />}
                  sx={{ mb: 2 }}
                >
                  Choose File
                </Button>
              </label>

              {file && (
                <Fade in={true}>
                  <Card sx={{ mt: 2, textAlign: "center" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 1 }}>
                        <Description sx={{ mr: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {fileName}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {fileSize} • {file.type}
                      </Typography>
                    </CardContent>
                  </Card>
                </Fade>
              )}
            </Box>

            {file && (
              <Box sx={{ textAlign: "center" }}>
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Insights />
                  }
                  sx={{ minWidth: 200 }}
                >
                  {loading ? "Analyzing..." : "Analyze Report"}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>


        <Grid item xs={12} md={6}>
          {analysis && (
            <Fade in={true}>
              <Paper sx={{ p: 4, borderRadius: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                  <Typography variant="h5">
                    <Insights sx={{ mr: 1 }} />
                    AI Analysis Results
                  </Typography>
                  <Chip label="AI Generated" color="success" variant="outlined" size="small" />
                </Box>

                {/* Summary */}
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6">📋 Summary</Typography>
                      <TranslationButton
                        text={analysis.summary}
                        onTranslate={(text) => handleTranslateSection('summary', text)}
                        translatedText={translatedData.summary}
                        loading={translationLoading}
                        variant="text"
                        size="small"
                        showIcon={false}
                      />
                    </Box>
                    <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2 }}>
                      {analysis.summary}
                    </Typography>
                    {translatedData.summary && (
                      <Typography variant="body1" sx={urduTextStyle}>
                        {translatedData.summary}
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                {/* Key Findings */}
                {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        🔍 Key Findings
                      </Typography>
                      <List dense>
                        {analysis.keyFindings.map((item, i) => (
                          <ListItem key={i} sx={{ px: 0, flexDirection: 'column'}}>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 , alignSelf: 'flex-start' }}>
                              • {item}
                            </Typography>
                            {translatedData.keyFindings[i] && (
                              <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem'  , alignSelf: 'flex-end' }}>
                                • {translatedData.keyFindings[i]}
                              </Typography>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Abnormal Values */}
                {analysis.abnormalValues && analysis.abnormalValues.length > 0 && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        ⚠️ Abnormal Values
                      </Typography>
                      <List dense>
                        {analysis.abnormalValues.map((item, i) => (
                          <ListItem key={i} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                              • {item}
                            </Typography>
                            {translatedData.abnormalValues[i] && (
                              <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem' , alignSelf: 'flex-end' }}>
                                • {translatedData.abnormalValues[i]}
                              </Typography>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Doctor Questions */}
                {analysis.doctorQuestions && analysis.doctorQuestions.length > 0 && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        🩺 Questions for Doctor
                      </Typography>
                      <List dense>
                        {analysis.doctorQuestions.map((item, i) => (
                          <ListItem key={i} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                              • {item}
                            </Typography>
                            {translatedData.doctorQuestions[i] && (
                              <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem'  , alignSelf: 'flex-end'}}>
                                • {translatedData.doctorQuestions[i]}
                              </Typography>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Home Remedies */}
                {analysis.homeRemedies && analysis.homeRemedies.length > 0 && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        🏠 Home Remedies
                      </Typography>
                      <List dense>
                        {analysis.homeRemedies.map((item, i) => (
                          <ListItem key={i} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                            <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                              • {item}
                            </Typography>
                            {translatedData.homeRemedies[i] && (
                              <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem'  , alignSelf: 'flex-end' }}>
                                • {translatedData.homeRemedies[i]}
                              </Typography>
                            )}
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                )}

                {/* Food Suggestions */}
                {analysis.foodSuggestions && (
                  <Card sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        🍎 Food Suggestions
                      </Typography>
                      
                      {analysis.foodSuggestions.recommended && analysis.foodSuggestions.recommended.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="subtitle1" color="success.main" sx={{ mb: 1 }}>
                            ✅ Recommended:
                          </Typography>
                          <List dense>
                            {analysis.foodSuggestions.recommended.map((item, i) => (
                              <ListItem key={i} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                                  • {item}
                                </Typography>
                                {translatedData.foodSuggestions.recommended[i] && (
                                  <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem'  , alignSelf: 'flex-end' }}>
                                    • {translatedData.foodSuggestions.recommended[i]}
                                  </Typography>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}

                      {analysis.foodSuggestions.avoid && analysis.foodSuggestions.avoid.length > 0 && (
                        <Box>
                          <Typography variant="subtitle1" color="error.main" sx={{ mb: 1 }}>
                            ❌ Avoid:
                          </Typography>
                          <List dense>
                            {analysis.foodSuggestions.avoid.map((item, i) => (
                              <ListItem key={i} sx={{ px: 0, flexDirection: 'column', alignItems: 'flex-start' }}>
                                <Typography variant="body2" sx={{ lineHeight: 1.6, mb: 1 }}>
                                  • {item}
                                </Typography>
                                {translatedData.foodSuggestions.avoid[i] && (
                                  <Typography variant="body2" sx={{ ...urduTextStyle, fontSize: '0.9rem' , alignSelf: 'flex-end'  }}>
                                    • {translatedData.foodSuggestions.avoid[i]}
                                  </Typography>
                                )}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Friendly Note */}
                {analysis.friendlyNote && (
                  <Card sx={{ mb: 3, bgcolor: 'warning.50' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        💡 Important Note
                      </Typography>
                      <Typography variant="body1" sx={{ lineHeight: 1.6, mb: 2, fontStyle: 'italic' }}>
                        {analysis.friendlyNote}
                      </Typography>
                      {translatedData.friendlyNote && (
                        <Typography variant="body1" sx={{ ...urduTextStyle, fontStyle: 'italic' ,textAlign: 'right' }}>
                          {translatedData.friendlyNote}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<SmartToy />}
                  onClick={() => setShowAIChat(true)}
                  sx={{ mt: 2 }}
                >
                  Ask Questions About This Report
                </Button>
              </Paper>
            </Fade>
          )}
        </Grid>
      </Grid>

      {showAIChat && analysis && (
        <AIChat
          context="report"
          reportId={fileId}
          onClose={() => setShowAIChat(false)}
          position="fixed"
        />
      )}
    </Container>
  );
};

export default UploadReport;