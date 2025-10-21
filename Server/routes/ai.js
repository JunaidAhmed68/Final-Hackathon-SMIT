import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import fs from 'fs';
import File from '../models/File.js';
import AIInsight from '../models/AiInsight.js';
import Vitals from '../models/Vitals.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------- File Upload Setup ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// ---------- Prompt Template ----------
const HEALTH_ANALYSIS_PROMPT = `
You are HealthMate, a medical AI assistant. Analyze the provided medical content and provide a comprehensive response in the following structured JSON format:

{
  "abnormalValues": ["list of abnormal values with explanations"],
  "keyFindings": ["main findings from the report"],
  "summary": "Detailed summary in English",
  "urduSummary": "Roman Urdu translation of the summary",
  "doctorQuestions": ["3-5 relevant questions to ask doctor"],
  "foodSuggestions": {
    "avoid": ["foods to avoid"],
    "recommended": ["recommended foods"]
  },
  "homeRemedies": ["suggested home remedies"],
  "friendlyNote": "Always consult your doctor before making any decision."
}

Content to analyze:
`;

// ---------- Chat Prompt Template ----------
const CHAT_PROMPT_TEMPLATE = `
You are HealthMate AI, a friendly and knowledgeable medical AI assistant. Your role is to help users understand their health data while being cautious and always recommending professional medical consultation.

IMPORTANT GUIDELINES:
- Be empathetic and supportive
- Never provide medical diagnoses
- Always suggest consulting healthcare professionals
- Explain medical terms in simple language
- Base responses on the provided context when available
- If unsure, admit limitations and suggest professional help

User Context: {CONTEXT}
Conversation History: {HISTORY}

Current Question: {QUESTION}

Please provide a helpful, accurate response that:
1. Answers the question based on available information
2. Explains any medical concepts clearly
3. Includes relevant suggestions when appropriate
4. Ends with a reminder to consult healthcare providers
`;

// ========== 🔍 1. Analyze Uploaded File ==========
router.post('/analyze-file', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const { fileType = 'report' } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ error: true, message: 'No file uploaded' });

    const fileDoc = new File({
      userId: req.user._id,
      filename: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: file.path,
      fileType
    });
    await fileDoc.save();

    const fileBuffer = fs.readFileSync(file.path);
    const base64Data = fileBuffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = HEALTH_ANALYSIS_PROMPT + 'Medical report file analysis';

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: base64Data, mimeType: file.mimetype } },
    ]);

    const response = await result.response;
    let text = response.text();

    // 🧹 Clean response to make it valid JSON
    text = text.replace(/```json|```/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (err) {
      console.error('Invalid JSON from Gemini:', text);
      throw new Error('AI returned invalid JSON format');
    }

    const aiInsight = new AIInsight({
      userId: req.user._id,
      fileId: fileDoc._id,
      inputType: 'file',
      fileAnalysis: analysis,
      geminiResponse: response,
    });
    await aiInsight.save();

    res.status(200).json({
      error: false,
      message: 'File analyzed successfully',
      data: analysis,
      fileId: fileDoc._id,
      insightId: aiInsight._id,
    });

  } catch (error) {
    console.error('File analysis error:', error);
    res.status(500).json({ error: true, message: 'Analysis failed: ' + error.message });
  }
});

// ========== 💬 2. Analyze Text Input ==========
router.post('/analyze-text', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: true, message: 'Text input required' });

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const prompt = HEALTH_ANALYSIS_PROMPT + text;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textOutput = response.text();

    textOutput = textOutput.replace(/```json|```/g, '').trim();

    let analysis;
    try {
      analysis = JSON.parse(textOutput);
    } catch (err) {
      console.error('Invalid JSON from Gemini:', textOutput);
      throw new Error('AI returned invalid JSON format');
    }

    const aiInsight = new AIInsight({
      userId: req.user._id,
      inputType: 'text',
      userInput: text,
      fileAnalysis: analysis,
      geminiResponse: response,
    });
    await aiInsight.save();

    res.status(200).json({
      error: false,
      message: 'Text analyzed successfully',
      data: analysis,
      insightId: aiInsight._id,
    });

  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({ error: true, message: 'Analysis failed: ' + error.message });
  }
});

// ========== ❤️ 3. Add Manual Vitals ==========
router.post('/add-vitals', authMiddleware, async (req, res) => {
  try {
    const { bloodPressure, bloodSugar, weight, heartRate, temperature, notes, date } = req.body;

    const vitals = new Vitals({
      userId: req.user._id,
      date: date ? new Date(date) : new Date(),
      bloodPressure,
      bloodSugar,
      weight,
      heartRate,
      temperature,
      notes,
    });

    await vitals.save();
    res.status(200).json({ error: false, message: 'Vitals recorded successfully', data: vitals });

  } catch (error) {
    console.error('Vitals save error:', error);
    res.status(500).json({ error: true, message: 'Failed to save vitals' });
  }
});

// ========== 🕒 4. Get Timeline ==========
router.get('/timeline', authMiddleware, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user._id }).sort({ uploadDate: -1 });
    const vitals = await Vitals.find({ userId: req.user._id }).sort({ date: -1 });
    const insights = await AIInsight.find({ userId: req.user._id }).populate('fileId').sort({ createdAt: -1 });

    const timeline = [
      ...files.map(f => ({ type: 'file', data: f, date: f.uploadDate })),
      ...vitals.map(v => ({ type: 'vitals', data: v, date: v.date })),
      ...insights.map(i => ({ type: 'insight', data: i, date: i.createdAt })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.status(200).json({ error: false, message: 'Timeline fetched successfully', data: timeline });
  } catch (error) {
    console.error('Timeline fetch error:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch timeline' });
  }
});

// ========== 🤖 5. AI Chat Endpoint ==========
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { message, context, reportId, conversationHistory = [] } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: true, message: 'Message is required' });
    }

    // Get user's health data for context
    let healthContext = 'General health inquiry.';
    
    if (context === 'report' && reportId) {
      const report = await File.findById(reportId);
      if (report) {
        healthContext = `The user is asking about their medical report titled "${report.originalName}". `;
        
        // Add report insights if available
        const insights = await AIInsight.findOne({ fileId: reportId });
        if (insights && insights.fileAnalysis) {
          healthContext += `AI analysis summary: ${insights.fileAnalysis.summary}. `;
          if (insights.fileAnalysis.keyFindings) {
            healthContext += `Key findings: ${insights.fileAnalysis.keyFindings.join(', ')}. `;
          }
        }
      }
    } else if (context === 'dashboard') {
      // Get user's recent health data
      const recentVitals = await Vitals.find({ userId: req.user._id })
        .sort({ date: -1 })
        .limit(5);
      
      const recentReports = await File.find({ userId: req.user._id })
        .sort({ uploadDate: -1 })
        .limit(3);
      
      const recentInsights = await AIInsight.find({ userId: req.user._id })
        .populate('fileId')
        .sort({ createdAt: -1 })
        .limit(3);

      healthContext = `User's health overview: ${recentVitals.length} recent vital recordings, ${recentReports.length} medical reports, ${recentInsights.length} AI insights. `;
      
      // Add recent vital trends if available
      if (recentVitals.length > 0) {
        const latestVital = recentVitals[0];
        if (latestVital.bloodPressure) {
          healthContext += `Latest blood pressure: ${latestVital.bloodPressure.systolic}/${latestVital.bloodPressure.diastolic} mmHg. `;
        }
        if (latestVital.heartRate) {
          healthContext += `Latest heart rate: ${latestVital.heartRate} bpm. `;
        }
      }
    } else if (context === 'vitals') {
      const recentVitals = await Vitals.find({ userId: req.user._id })
        .sort({ date: -1 })
        .limit(10);
      
      healthContext = `User's vital signs data: ${recentVitals.length} recordings available. `;
      
      if (recentVitals.length > 0) {
        const latest = recentVitals[0];
        healthContext += `Most recent: `;
        if (latest.bloodPressure) healthContext += `BP: ${latest.bloodPressure.systolic}/${latest.bloodPressure.diastolic}, `;
        if (latest.heartRate) healthContext += `HR: ${latest.heartRate}bpm, `;
        if (latest.temperature) healthContext += `Temp: ${latest.temperature}°C. `;
      }
    }

    // Build conversation history for context
    const historyContext = conversationHistory
      .slice(-6) // Last 6 messages for context
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    // Create the chat prompt
    const chatPrompt = CHAT_PROMPT_TEMPLATE
      .replace('{CONTEXT}', healthContext)
      .replace('{HISTORY}', historyContext || 'No previous conversation.')
      .replace('{QUESTION}', message);

    // Call Gemini AI
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Extract potential sources from the response
    const sources = extractSources(aiResponse, context, reportId);

    res.json({
      error: false,
      response: aiResponse,
      sources: sources,
      confidence: 95, // You can make this dynamic based on response quality
      context: context
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: true, 
      message: 'Failed to process chat message: ' + error.message 
    });
  }
});

// Helper function to extract sources from response
function extractSources(response, context, reportId) {
  const sources = [];
  
  if (context === 'report' && reportId) {
    sources.push('Medical Report Analysis');
    sources.push('AI Health Insights');
  }
  
  if (response.includes('blood pressure') || response.includes('BP')) {
    sources.push('Vital Signs Data');
  }
  
  if (response.includes('report') || response.includes('test') || response.includes('lab')) {
    sources.push('Medical Reports');
  }
  
  if (response.includes('diet') || response.includes('food') || response.includes('nutrition')) {
    sources.push('Nutrition Guidelines');
  }
  
  sources.push('Medical Knowledge Base');
  
  return sources;
}

// ========== 📊 6. Get Report Insights ==========
router.get('/insights/:reportId', authMiddleware, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const insights = await AIInsight.findOne({ 
      fileId: reportId, 
      userId: req.user._id 
    }).populate('fileId');

    if (!insights) {
      return res.status(404).json({ 
        error: true, 
        message: 'No insights found for this report' 
      });
    }

    res.json({
      error: false,
      data: {
        summary: insights.fileAnalysis?.summary,
        keyFindings: insights.fileAnalysis?.keyFindings?.map((finding, index) => ({
          id: index,
          description: finding,
          severity: determineSeverity(finding)
        })),
        abnormalValues: insights.fileAnalysis?.abnormalValues,
        doctorQuestions: insights.fileAnalysis?.doctorQuestions,
        foodSuggestions: insights.fileAnalysis?.foodSuggestions,
        homeRemedies: insights.fileAnalysis?.homeRemedies,
        severity: determineOverallSeverity(insights.fileAnalysis)
      }
    });

  } catch (error) {
    console.error('Insights fetch error:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch insights' });
  }
});

// Helper function to determine severity
function determineSeverity(finding) {
  const lowerFinding = finding.toLowerCase();
  if (lowerFinding.includes('critical') || lowerFinding.includes('severe') || lowerFinding.includes('emergency')) {
    return 'high';
  } else if (lowerFinding.includes('elevated') || lowerFinding.includes('abnormal') || lowerFinding.includes('concern')) {
    return 'medium';
  }
  return 'low';
}

// Helper function to determine overall severity
function determineOverallSeverity(analysis) {
  if (!analysis.keyFindings) return 'info';
  
  const findings = analysis.keyFindings.join(' ').toLowerCase();
  if (findings.includes('critical') || findings.includes('severe')) {
    return 'high';
  } else if (findings.includes('abnormal') || findings.includes('elevated')) {
    return 'medium';
  } else if (findings.includes('normal') || findings.includes('within range')) {
    return 'low';
  }
  return 'info';
}


// ========== 📄 7. Get Single Report ==========
router.get('/report/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await File.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!report) {
      return res.status(404).json({ 
        error: true, 
        message: 'Report not found' 
      });
    }

    res.json({
      error: false,
      data: report
    });

  } catch (error) {
    console.error('Report fetch error:', error);
    res.status(500).json({ error: true, message: 'Failed to fetch report' });
  }
});

// ========== 📥 8. Download Report ==========
router.get('/report/:id/download', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await File.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!report) {
      return res.status(404).json({ 
        error: true, 
        message: 'Report not found' 
      });
    }

    if (!fs.existsSync(report.url)) {
      return res.status(404).json({ 
        error: true, 
        message: 'File not found on server' 
      });
    }

    res.setHeader('Content-Type', report.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${report.originalName}"`);
    
    const fileStream = fs.createReadStream(report.url);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: true, message: 'Failed to download file' });
  }
});

// ========== 🖼️ 9. Get Report Preview ==========
router.get('/report/:id/preview', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    const report = await File.findOne({ 
      _id: id, 
      userId: req.user._id 
    });

    if (!report) {
      return res.status(404).json({ 
        error: true, 
        message: 'Report not found' 
      });
    }

    // For PDF files, serve them directly
    if (report.mimeType === 'application/pdf') {
      if (!fs.existsSync(report.url)) {
        return res.status(404).json({ 
          error: true, 
          message: 'File not found on server' 
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${report.originalName}"`);
      
      const fileStream = fs.createReadStream(report.url);
      fileStream.pipe(res);
    } else {
      // For other file types, return the file URL
      res.json({
        error: false,
        data: {
          fileUrl: `/api/ai/report/${id}/download`,
          mimeType: report.mimeType,
          originalName: report.originalName
        }
      });
    }

  } catch (error) {
    console.error('Preview error:', error);
    res.status(500).json({ error: true, message: 'Failed to generate preview' });
  }
});



export default router;