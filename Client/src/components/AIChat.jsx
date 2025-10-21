// components/AIChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  CircularProgress,
  Fade,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  Send,
  SmartToy,
  Person,
  Close,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

const AIChat = ({ context, reportId, onClose, position = 'fixed' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message based on context
  useEffect(() => {
    let welcomeMessage = "Hello! I'm your AI Health Assistant. How can I help you today?";
    
    if (context === 'report' && reportId) {
      welcomeMessage = "I've analyzed this medical report. Ask me anything about its contents, findings, or what they mean for your health.";
    } else if (context === 'dashboard') {
      welcomeMessage = "I'm here to help you understand your health data. You can ask me about your reports, vitals, insights, or general health questions.";
    } else if (context === 'vitals') {
      welcomeMessage = "I can help you understand your vital signs and what they mean for your health. Feel free to ask about any measurements or trends.";
    }

    setMessages([
      {
        id: 1,
        text: welcomeMessage,
        isAI: true,
        timestamp: new Date(),
      }
    ]);
  }, [context, reportId]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isAI: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        'http://localhost:3000/ai/chat',
        {
          message: input,
          context: context,
          reportId: reportId,
          conversationHistory: messages.slice(-10).map(msg => ({
            role: msg.isAI ? 'assistant' : 'user',
            content: msg.text
          }))
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const aiMessage = {
        id: Date.now() + 1,
        text: response.data.response,
        isAI: true,
        timestamp: new Date(),
        sources: response.data.sources,
        confidence: response.data.confidence,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isAI: true,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = {
    report: [
      "What are the key findings in this report?",
      "Should I be concerned about any values?",
      "What do these medical terms mean?",
      "What should I discuss with my doctor?",
    ],
    dashboard: [
      "What's my overall health status?",
      "Are there any concerning trends in my data?",
      "How can I improve my health metrics?",
      "What do my latest vitals indicate?",
    ],
    vitals: [
      "Are my blood pressure readings normal?",
      "What's a healthy heart rate range for me?",
      "How can I improve my vital signs?",
      "Should I be concerned about any measurements?",
    ]
  };

  if (isMinimized) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: position,
          bottom: 20,
          right: 20,
          width: 300,
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          border: `2px solid black 20`,
        }}
      >
        <Box
          sx={{
            p: 2,
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setIsMinimized(false)}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <SmartToy sx={{ mr: 1 }} />
            AI Health Assistant
          </Typography>
          <ExpandMore />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={16}
      sx={{
        position: position,
        bottom: 20,
        right: 20,
        width: 400,
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: `2px solid  black 20`,
        zIndex: 9999,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: 'primary.main',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <SmartToy sx={{ mr: 1 }} />
          AI Health Assistant
        </Typography>
        <Box>
          <IconButton 
            size="small" 
            sx={{ color: 'white' }} 
            onClick={() => setIsMinimized(true)}
          >
            <ExpandMore />
          </IconButton>
          {onClose && (
            <IconButton 
              size="small" 
              sx={{ color: 'white', ml: 1 }} 
              onClick={onClose}
            >
              <Close />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'grey.50',
        }}
      >
        {messages.map((message) => (
          <Fade in key={message.id}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.isAI ? 'flex-start' : 'flex-end',
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  maxWidth: '80%',
                  flexDirection: message.isAI ? 'row' : 'row-reverse',
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: message.isAI ? 'primary.main' : 'secondary.main',
                    mx: 1,
                  }}
                >
                  {message.isAI ? <SmartToy /> : <Person />}
                </Avatar>
                <Card
                  sx={{
                    bgcolor: message.isAI ? 'white' : 'primary.main',
                    color: message.isAI ? 'text.primary' : 'white',
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {message.text}
                    </Typography>
                    
                    {message.sources && message.sources.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                          Sources:
                        </Typography>
                        {message.sources.map((source, index) => (
                          <Chip
                            key={index}
                            label={source}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5, fontSize: '0.6rem' }}
                          />
                        ))}
                      </Box>
                    )}
                    
                    {message.confidence && (
                      <Chip
                        label={`Confidence: ${message.confidence}%`}
                        size="small"
                        color={
                          message.confidence > 80 ? 'success' :
                          message.confidence > 60 ? 'warning' : 'error'
                        }
                        sx={{ mt: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Fade>
        ))}
        
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', mx: 1 }}>
              <SmartToy />
            </Avatar>
            <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CircularProgress size={16} sx={{ mr: 1 }} />
                  <Typography variant="body2">Thinking...</Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Suggested Questions */}
      {messages.length <= 2 && suggestedQuestions[context] && (
        <Box sx={{ p: 1, bgcolor: 'grey.100' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
            Suggested questions:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, p: 1 }}>
            {suggestedQuestions[context].map((question, index) => (
              <Chip
                key={index}
                label={question}
                size="small"
                onClick={() => setInput(question)}
                sx={{ cursor: 'pointer' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Ask me anything about your health data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
          multiline
          maxRows={3}
          InputProps={{
            endAdornment: (
              <IconButton 
                onClick={handleSend} 
                disabled={!input.trim() || loading}
                color="primary"
              >
                {loading ? <CircularProgress size={20} /> : <Send />}
              </IconButton>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default AIChat;