// models/AIInsight.js
import mongoose from 'mongoose';

const aiInsightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    inputType: { 
      type: String, 
      enum: ['file', 'text', 'vitals'],
      required: true 
    },
    userInput: { type: String }, // For text prompts
    fileAnalysis: {
      abnormalValues: [String],
      keyFindings: [String],
      summary: String,
      urduSummary: String,
      doctorQuestions: [String],
      foodSuggestions: {
        avoid: [String],
        recommended: [String]
      },
      homeRemedies: [String],
      friendlyNote: { type: String, default: "Always consult your doctor before making any decision." }
    },
    geminiResponse: { type: Object } // Raw response from Gemini
  },
  { timestamps: true }
);

const AIInsight = mongoose.models.AIInsight || mongoose.model('AIInsight', aiInsightSchema);
export default AIInsight;