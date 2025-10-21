import express from 'express';

const router = express.Router();

router.post('/english-to-urdu', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    // Using Google Translate with fetch (no API key needed)
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ur&dt=t&q=${encodeURIComponent(text)}`);
    const data = await response.json();
    
    const translatedText = data[0].map(item => item[0]).join('');

    res.json({
      success: true,
      data: {
        originalText: text,
        translatedText: translatedText,
        sourceLang: 'en',
        targetLang: 'ur'
      }
    });

  } catch (error) {
    console.error('Translation error:', error);
    
    const requestText = req.body?.text || '';
    
    res.json({
      success: true,
      data: {
        originalText: requestText,
        translatedText: requestText,
        sourceLang: 'en',
        targetLang: 'ur',
        note: 'Translation service temporarily unavailable'
      }
    });
  }
});

export default router;