const express = require('express');
const { read, write } = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/wildlife
router.get('/', authMiddleware, (req, res) => {
  const db = read();
  res.json(db.wildlife);
});

// POST /api/wildlife  (admin only)
router.post('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const { name, population, status } = req.body;
  if (!name || population === undefined) {
    return res.status(400).json({ message: 'name and population are required' });
  }
  const db = read();
  const entry = { id: db.nextWildlifeId++, name, population: Number(population), status: status || 'Unknown' };
  db.wildlife.push(entry);
  write(db);
  res.status(201).json(entry);
});

// PUT /api/wildlife/:id  (admin only)
router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const db = read();
  const item = db.wildlife.find(w => w.id === Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Wildlife entry not found' });

  const { name, population, status } = req.body;
  if (name !== undefined) item.name = name;
  if (population !== undefined) item.population = Number(population);
  if (status !== undefined) item.status = status;

  write(db);
  res.json(item);
});

// DELETE /api/wildlife/:id  (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const db = read();
  const idx = db.wildlife.findIndex(w => w.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Wildlife entry not found' });
  db.wildlife.splice(idx, 1);
  write(db);
  res.json({ message: 'Wildlife entry deleted' });
});

module.exports = router;
