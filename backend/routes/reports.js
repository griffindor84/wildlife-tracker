const express = require('express');
const { read, write } = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/reports
router.get('/', authMiddleware, (req, res) => {
  const db = read();
  // Admins see all; regular users see only their own
  const reports = req.user.role === 'Administrator'
    ? db.reports
    : db.reports.filter(r => r.userId === req.user.id);
  res.json(reports);
});

// POST /api/reports
router.post('/', authMiddleware, (req, res) => {
  const { reportType, species, location, coordinates, date, description } = req.body;

  if (!reportType || !location || !date) {
    return res.status(400).json({ message: 'reportType, location and date are required' });
  }

  const db = read();
  const newReport = {
    id: db.nextReportId++,
    userId: req.user.id,
    reportType,
    species: species || '',
    location,
    coordinates: coordinates || null,
    date,
    description: description || '',
    createdAt: new Date().toISOString(),
  };

  db.reports.push(newReport);
  write(db);
  res.status(201).json(newReport);
});

module.exports = router;
