const express = require('express');
const { pool } = require('../middleware/db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/reports — all for admins, own for others
router.get('/', auth, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'Administrator') {
      result = await pool.query(
        `SELECT r.*, u.name AS user_name
         FROM reports r
         JOIN users u ON r.user_id = u.id
         ORDER BY r.created_at DESC`
      );
    } else {
      result = await pool.query(
        'SELECT * FROM reports WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reports — submit a report
router.post('/', auth, async (req, res) => {
  const { title, description } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  try {
    const result = await pool.query(
      'INSERT INTO reports (user_id, title, description) VALUES ($1, $2, $3) RETURNING *',
      [req.user.id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;