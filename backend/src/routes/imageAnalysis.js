const express = require('express');
const multer  = require('multer');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const HF_API_KEY   = process.env.HF_API_KEY;
const HF_URL       = 'https://api-inference.huggingface.co/models/google/vit-base-patch16-224';

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded. Field name must be "image".' });
  }

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported file type. Use JPEG, PNG, WEBP, or GIF.' });
  }

  try {
    const response = await fetch(HF_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
        'Content-Type': req.file.mimetype,
      },
      body: req.file.buffer,
    });

    if (response.status === 503) {
      return res.status(503).json({ error: 'Model loading. Try again in 20 seconds.' });
    }

    if (!response.ok) {
      const errText = await response.text();
      console.error('HF API error:', response.status, errText);
      return res.status(500).json({ error: 'Image analysis failed', details: errText });
    }

    const result = await response.json();

    if (!result || result.length === 0) {
      return res.status(500).json({ error: 'Model returned no predictions' });
    }

    const sorted = result.sort((a, b) => b.score - a.score).slice(0, 5);
    const top    = sorted[0];
    const cleanLabel = (label) => label.split(',')[0].trim();
    const confidence = top.score > 0.7 ? 'high' : top.score > 0.4 ? 'medium' : 'low';

    res.json({
      species:     cleanLabel(top.label),
      labels:      sorted.map(l => cleanLabel(l.label)),
      confidence,
      description: `Detected ${cleanLabel(top.label)} with ${(top.score * 100).toFixed(2)}% confidence.`,
      habitat:     null,
      raw:         sorted.map(l => ({ label: l.label, score: (l.score * 100).toFixed(2) + '%' })),
    });

  } catch (err) {
    console.error('Image analysis error:', err.message);
    res.status(500).json({ error: 'Image analysis failed', details: err.message });
  }
});

module.exports = router;