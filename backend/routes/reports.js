const express = require('express');
const db = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports
router.get('/', authMiddleware, (req, res) => {
  let rows;
  if (req.user.role === 'Administrator') {
    rows = db.prepare('SELECT * FROM reports').all();
  } else {
    rows = db.prepare('SELECT * FROM reports WHERE userId = ?').all(req.user.id);
  }
  // Parse coordinates JSON string back to object
  const reports = rows.map(r => ({
    ...r,
    coordinates: r.coordinates ? JSON.parse(r.coordinates) : null,
  }));
  res.json(reports);
});

// POST /api/reports
router.post('/', authMiddleware, (req, res) => {
  const { reportType, species, location, coordinates, date, description } = req.body;

  if (!reportType || !location || !date) {
    return res.status(400).json({ message: 'reportType, location and date are required' });
  }

  const createdAt = new Date().toISOString();
  const coordStr = coordinates ? JSON.stringify(coordinates) : null;

  const result = db.prepare(
    `INSERT INTO reports (userId, reportType, species, location, coordinates, date, description, createdAt)
     VALUES (?,?,?,?,?,?,?,?)`
  ).run(req.user.id, reportType, species || '', location, coordStr, date, description || '', createdAt);

  res.status(201).json({
    id: result.lastInsertRowid,
    userId: req.user.id,
    reportType,
    species: species || '',
    location,
    coordinates: coordinates || null,
    date,
    description: description || '',
    createdAt,
  });
});

module.exports = router;

