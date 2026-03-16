const express = require('express');
const { pool } = require('../middleware/db');

const router = express.Router();

// POST /api/auth/sync — called after Supabase registration
// Syncs the Supabase user into our PostgreSQL users table
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

// POST /api/auth/login — kept for backward compatibility
router.post('/login', async (req, res) => {
  res.json({ message: 'Use Supabase auth directly from frontend' });
});

// POST /api/auth/register — kept for backward compatibility  
router.post('/register', async (req, res) => {
  res.json({ message: 'Use Supabase auth directly from frontend' });
});

module.exports = router;