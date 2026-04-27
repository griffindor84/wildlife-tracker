const express = require('express');
const { pool } = require('../middleware/db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const router = express.Router();

// GET /api/wildlife — any authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM wildlife ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/wildlife — admin only
router.post('/', auth, adminOnly, async (req, res) => {
  const { name, species, description, habitat, status } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  try {
    const result = await pool.query(
      'INSERT INTO wildlife (name, species, description, habitat, status) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, species, description, habitat, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/wildlife/:id — admin only
router.put('/:id', auth, adminOnly, async (req, res) => {
  const { name, species, description, habitat, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE wildlife
       SET name=$1, species=$2, description=$3, habitat=$4, status=$5
       WHERE id=$6
       RETURNING *`,
      [name, species, description, habitat, status, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Wildlife entry not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/wildlife/:id — admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM wildlife WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Wildlife entry not found' });
    res.json({ message: 'Wildlife entry deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;