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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // ✅ Free & supported model
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

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // ✅ Same free model
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










export default router;
