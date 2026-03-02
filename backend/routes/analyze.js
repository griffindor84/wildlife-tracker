const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Use memory storage – we read the buffer but don't persist uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  },
});

// Common African wildlife species used as suggestion labels
const WILDLIFE_LABELS = [
  'African Elephant', 'Lion', 'Leopard', 'Black Rhino', 'White Rhino',
  'African Buffalo', 'Giraffe', 'Zebra', 'Cheetah', 'Hippopotamus',
  'Mountain Gorilla', 'Chimpanzee', 'African Wild Dog', 'Hyena',
  'Wildebeest', 'Impala', 'Thomson\'s Gazelle', 'Crocodile', 'Flamingo',
  'Secretary Bird',
];

/**
 * POST /api/analyze-image
 * Accepts a multipart form upload with field name "image".
 * Returns an array of suggested species labels.
 *
 * NOTE: In production this endpoint would integrate with a real
 * computer-vision API (e.g. Google Vision, AWS Rekognition).
 * For now it returns a randomised selection of wildlife labels so
 * that the frontend AddObservation AI-suggestion flow works end-to-end.
 */
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded' });
  }

  // Seed the pseudo-random shuffle from the file size so different
  // uploads consistently return different (but deterministic) results.
  const seed = req.file.size % WILDLIFE_LABELS.length;
  const shuffled = [...WILDLIFE_LABELS]
    .map((label, i) => ({ label, sort: (i + seed) % WILDLIFE_LABELS.length }))
    .sort((a, b) => a.sort - b.sort)
    .map(item => item.label);

  res.json({ labels: shuffled.slice(0, 5) });
});

module.exports = router;
