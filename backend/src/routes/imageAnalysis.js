const express = require('express');
const multer = require('multer');
const { HfInference } = require('@huggingface/inference');

const router = express.Router();

const hf = new HfInference(process.env.HF_API_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const allowedTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
];

router.post('/', upload.single('image'), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: 'No image uploaded. Field name must be "image".'
    });
  }

  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({
      error: 'Unsupported file type. Use JPEG, PNG, WEBP, or GIF.'
    });
  }

  try {

    const result = await hf.imageClassification({
      model: "microsoft/resnet-50",
      data: req.file.buffer
    });

    if (!result || result.length === 0) {
      return res.status(500).json({
        error: "Model returned no predictions"
      });
    }

    const sorted = result
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    const top = sorted[0];

    const cleanLabel = (label) =>
      label.split(',')[0].trim();

    const confidence =
      top.score > 0.7 ? "high"
      : top.score > 0.4 ? "medium"
      : "low";

    res.json({

      species: cleanLabel(top.label),

      labels: sorted.map(l =>
        cleanLabel(l.label)
      ),

      confidence,

      description: `Detected ${cleanLabel(top.label)} with ${(top.score * 100).toFixed(2)}% confidence.`,

      habitat: null,

      raw: sorted.map(l => ({
        label: l.label,
        score: (l.score * 100).toFixed(2) + "%"
      }))

    });

  } catch (err) {

    console.error("HF ERROR:", err);

    if (err.message?.includes("loading")) {
      return res.status(503).json({
        error: "Model loading. Try again in 20 seconds."
      });
    }

    return res.status(500).json({
      error: "Image analysis failed",
      details: err.message
    });
  }
});


module.exports = router;