const express   = require('express');
const multer    = require('multer');
const Anthropic = require('@anthropic-ai/sdk');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/analyze-image
// Accepts multipart/form-data with field "image"
// Returns { labels, species, habitat, description, confidence }
router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded. Use field name "image".' });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ error: 'Unsupported image type. Use JPEG, PNG, GIF or WEBP.' });
  }

  try {
    const base64Image = req.file.buffer.toString('base64');

    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: req.file.mimetype,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: `You are a wildlife identification expert. Analyze this image and respond ONLY with a JSON object — no explanation, no markdown, no extra text.

Use this exact structure:
{
  "labels": ["label1", "label2"],
  "species": "species name or null if not identifiable",
  "habitat": "habitat type or null",
  "description": "one sentence description of what you see",
  "confidence": "high | medium | low"
}`,
            },
          ],
        },
      ],
    });

    const raw = response.content[0].text.trim();
    const result = JSON.parse(raw);
    res.json(result);
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error('Failed to parse Claude response:', err);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }
    console.error('Anthropic API error:', err);
    res.status(500).json({ error: 'Image analysis failed' });
  }
});

module.exports = router;