const express = require('express');
const { read, write } = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/observations  (returns only the current user's observations)
router.get('/', authMiddleware, (req, res) => {
  const db = read();
  const obs = db.observations.filter(o => o.userId === req.user.id);
  res.json(obs);
});

// POST /api/observations
router.post('/', authMiddleware, (req, res) => {
  const { speciesName, date, location, type, notes } = req.body;

  if (!speciesName || !date || !location || !type) {
    return res.status(400).json({ message: 'speciesName, date, location and type are required' });
  }

  const db = read();
  const newObs = {
    id: db.nextObservationId++,
    userId: req.user.id,
    speciesName,
    date,
    location,
    type,
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  db.observations.push(newObs);
  write(db);
  res.status(201).json(newObs);
});

// DELETE /api/observations/:id
router.delete('/:id', authMiddleware, (req, res) => {
  const db = read();
  const idx = db.observations.findIndex(o => o.id === Number(req.params.id) && o.userId === req.user.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Observation not found' });
  }
  db.observations.splice(idx, 1);
  write(db);
  res.json({ message: 'Observation deleted' });
});

module.exports = router;
