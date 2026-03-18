const express = require('express');
const { pool } = require('../middleware/db');

const router = express.Router();

// POST /api/auth/sync — syncs Supabase user into PostgreSQL
router.post('/sync', async (req, res) => {
  const { supabase_id, email, name, role } = req.body;
  if (!supabase_id || !email) {
    return res.status(400).json({ error: 'supabase_id and email are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO users (supabase_id, name, email, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET supabase_id = $1, name = $2
       RETURNING id, name, email, role`,
      [supabase_id, name || email, email, role || 'Ranger']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Sync error:', err.message);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

// GET /api/auth/role/:supabaseId — get user role from DB
router.get('/role/:supabaseId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT role FROM users WHERE supabase_id = $1',
      [req.params.supabaseId]
    );
    if (result.rows.length === 0) {
      return res.json({ role: 'Ranger' });
    }
    res.json({ role: result.rows[0].role });
  } catch (err) {
    console.error('Role fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

module.exports = router;