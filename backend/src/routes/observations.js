const express = require('express');
const { pool } = require('../middleware/db');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/observations
router.get('/', auth, async (req, res) => {
  try {
    let result;
    if (req.user.role === 'Administrator') {
      // Admins see all observations
      result = await pool.query(
        `SELECT o.*, w.name AS wildlife_name, u.name AS user_name
         FROM observations o
         LEFT JOIN wildlife w ON o.wildlife_id = w.id
         LEFT JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
    } else {
      // Rangers see only their own
      result = await pool.query(
        `SELECT o.*, w.name AS wildlife_name
         FROM observations o
         LEFT JOIN wildlife w ON o.wildlife_id = w.id
         WHERE o.user_id = $1
         ORDER BY o.created_at DESC`,
        [req.user.id]
      );
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/observations
router.post('/', auth, async (req, res) => {
  const { wildlife_id, location, notes, observed_at } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO observations (user_id, wildlife_id, location, notes, observed_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.user.id, wildlife_id || null, location, notes, observed_at || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/observations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    // Admins can delete any observation, rangers only their own
    const query = req.user.role === 'Administrator'
      ? 'DELETE FROM observations WHERE id = $1 RETURNING id'
      : 'DELETE FROM observations WHERE id = $1 AND user_id = $2 RETURNING id';

    const params = req.user.role === 'Administrator'
      ? [req.params.id]
      : [req.params.id, req.user.id];

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Observation not found or not yours' });
    }
    res.json({ message: 'Observation deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;