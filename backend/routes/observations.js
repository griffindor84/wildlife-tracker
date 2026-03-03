const express = require('express');
const db = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/observations  (returns only the current user's observations)
router.get('/', authMiddleware, (req, res) => {
  const obs = db.prepare('SELECT * FROM observations WHERE userId = ?').all(req.user.id);
  res.json(obs);
});

// POST /api/observations
router.post('/', authMiddleware, (req, res) => {
  const { speciesName, date, location, type, notes } = req.body;

  if (!speciesName || !date || !location || !type) {
    return res.status(400).json({ message: 'speciesName, date, location and type are required' });
  }

  const createdAt = new Date().toISOString();
  const result = db.prepare(
    'INSERT INTO observations (userId, speciesName, date, location, type, notes, createdAt) VALUES (?,?,?,?,?,?,?)'
  ).run(req.user.id, speciesName, date, location, type, notes || '', createdAt);

  res.status(201).json({
    id: result.lastInsertRowid,
    userId: req.user.id,
    speciesName, date, location, type,
    notes: notes || '',
    createdAt,
  });
});

// DELETE /api/observations/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const result = db.prepare(
    'DELETE FROM observations WHERE id = ? AND userId = ?'
  ).run(Number(req.params.id), req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ message: 'Observation not found' });
  }
  res.json({ message: 'Observation deleted' });
});

module.exports = router;

