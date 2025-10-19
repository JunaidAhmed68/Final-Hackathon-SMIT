// import { GoogleGenerativeAI } from "@google/generative-ai";
// import MedicalReport from '../models/MedicalReport.js';

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export const analyzeMedicalReport = async (req, res) => {
//   try {
//     const { text, title = 'Medical Report', reportType = 'general' } = req.body;
//     const userId = req.user.id;

//     if (!text || text.trim().length < 10) {
//       return res.status(400).json({
//         success: false,
//         error: 'Medical text must be at least 10 characters long'
//       });
//     }

//     console.log('🔍 Analyzing medical report for user:', userId);

//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-pro",
//       generationConfig: {
//         temperature: 0.1,
//         topK: 40,
//         topP: 0.95,
//         maxOutputTokens: 2000,
//       }
//     });

//     const prompt = `
// CRITICAL: You are a medical AI assistant. Be accurate, clear, and cautious.

// MEDICAL REPORT TO ANALYZE:
// ${text}

// ANALYZE THIS MEDICAL REPORT AND PROVIDE OUTPUT IN THIS EXACT STRUCTURE:

// 1️⃣ ENGLISH SUMMARY:
// [Provide a clear, simple summary in plain English that a non-medical person can understand. Focus on key findings.]

// 2️⃣ ROMAN URDU SUMMARY:
// [Provide the same summary in Roman Urdu (Urdu written in English script). Keep it simple and clear.]

// 3️⃣ ABNORMAL VALUES:
// • [List each abnormal value with normal range]
// • [Briefly explain what each abnormal value might indicate]
// • [Highlight concerning values]

// 4️⃣ QUESTIONS FOR DOCTOR:
// • [Question 1 - specific to findings]
// • [Question 2 - about treatment options]
// • [Question 3 - about lifestyle changes]
// • [Question 4 - about follow-up tests]
// • [Question 5 - about prognosis]

// 5️⃣ HEALTH RECOMMENDATIONS:
// FOODS TO EAT:
// • [Specific food recommendation 1]
// • [Specific food recommendation 2]
// • [Specific food recommendation 3]

// FOODS TO AVOID:
// • [Specific food to avoid 1]
// • [Specific food to avoid 2]
// • [Specific food to avoid 3]

// HOME REMEDIES:
// • [Safe home remedy 1]
// • [Safe home remedy 2]
// • [Safe home remedy 3]

// 6️⃣ IMPORTANT DISCLAIMER:
// 🚩 Always consult your doctor before making any health decisions. This analysis is for informational purposes only and should not replace professional medical advice.

// Provide only the structured analysis above, no additional commentary.
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const analysis = response.text();

//     // Save to database
//     const medicalReport = await MedicalReport.create({
//       user: userId,
//       title,
//       originalText: text,
//       aiAnalysis: analysis,
//       reportType
//     });

//     res.json({
//       success: true,
//       message: 'Report analyzed successfully',
//       data: {
//         report: {
//           id: medicalReport._id,
//           title: medicalReport.title,
//           analysis: medicalReport.aiAnalysis,
//           createdAt: medicalReport.createdAt
//         }
//       }
//     });

//   } catch (error) {
//     console.error('❌ Analysis error:', error);
//     res.status(500).json({
//       success: false,
//       error: 'AI analysis failed',
//       message: error.message
//     });
//   }
// };

// export const testGemini = async (req, res) => {
//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });
//     const result = await model.generateContent("Hello! Respond with 'HealthMate AI is ready to analyze medical reports!'");
//     const response = await result.response;
    
//     res.json({
//       success: true,
//       message: 'Gemini AI is working',
//       response: response.text()
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: 'Gemini test failed',
//       message: error.message
//     });
//   }
// };