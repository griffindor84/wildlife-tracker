const express = require('express');
const db = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/wildlife
router.get('/', authMiddleware, (req, res) => {
  res.json(db.prepare('SELECT * FROM wildlife').all());
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
  const result = db.prepare(
    'INSERT INTO wildlife (name, population, status) VALUES (?,?,?)'
  ).run(name, Number(population), status || 'Unknown');

  res.status(201).json({ id: result.lastInsertRowid, name, population: Number(population), status: status || 'Unknown' });
});

// PUT /api/wildlife/:id  (admin only)
router.put('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const item = db.prepare('SELECT * FROM wildlife WHERE id = ?').get(Number(req.params.id));
  if (!item) return res.status(404).json({ message: 'Wildlife entry not found' });

  const { name, population, status } = req.body;
  const updated = {
    name:       name       !== undefined ? name       : item.name,
    population: population !== undefined ? Number(population) : item.population,
    status:     status     !== undefined ? status     : item.status,
  };

  db.prepare('UPDATE wildlife SET name=?, population=?, status=? WHERE id=?')
    .run(updated.name, updated.population, updated.status, item.id);

  res.json({ ...item, ...updated });
});

// DELETE /api/wildlife/:id  (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const result = db.prepare('DELETE FROM wildlife WHERE id = ?').run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ message: 'Wildlife entry not found' });
  res.json({ message: 'Wildlife entry deleted' });
});

module.exports = router;

