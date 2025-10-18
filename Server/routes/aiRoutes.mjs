// // routes/aiRoutes.js
// import express from 'express';
// import { 
//   testGemini, 
//   analyzeMedicalReport, 
//   chatWithGemini 
// } from '../controllers/geminiController.js';

// const router = express.Router();

// /**
//  * Test Gemini AI connection
//  */
// router.get('/test-gemini', async (req, res) => {
//   try {
//     console.log('🧪 Testing Gemini AI connection...');
//     const result = await testGemini();
    
//     res.json({
//       success: true,
//       message: 'Gemini AI is working correctly',
//       data: result
//     });
    
//   } catch (error) {
//     console.error('❌ Gemini test failed:', error);
    
//     res.status(500).json({
//       success: false,
//       error: 'Gemini AI test failed',
//       message: error.message,
//       suggestion: 'Check your API key and internet connection'
//     });
//   }
// });

// /**
//  * Analyze medical report
//  */
// router.post('/analyze-report', async (req, res) => {
//   try {
//     const { textContent } = req.body;
    
//     if (!textContent || textContent.trim().length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Text content is required'
//       });
//     }

//     console.log('🩺 Analyzing medical report...');
//     const analysis = await analyzeMedicalReport(textContent);
    
//     res.json({
//       success: true,
//       message: 'Medical report analyzed successfully',
//       analysis: analysis,
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error) {
//     console.error('❌ Medical analysis failed:', error);
    
//     res.status(500).json({
//       success: false,
//       error: 'Medical analysis failed',
//       message: error.message
//     });
//   }
// });

// /**
//  * Chat endpoint
//  */
// router.post('/chat', async (req, res) => {
//   try {
//     const { message } = req.body;
    
//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         error: 'Message is required'
//       });
//     }

//     const response = await chatWithGemini(message);
    
//     res.json({
//       success: true,
//       message: 'Chat response generated',
//       response: response,
//       timestamp: new Date().toISOString()
//     });
    
//   } catch (error) {
//     console.error('❌ Chat failed:', error);
    
//     res.status(500).json({
//       success: false,
//       error: 'Chat failed',
//       message: error.message
//     });
//   }
// });

// export default router;