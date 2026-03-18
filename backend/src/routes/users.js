const express   = require('express');
const { pool }  = require('../middleware/db');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const router = express.Router();

// GET /api/users — admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/users/:id/role — admin only
router.patch('/:id/role', auth, adminOnly, async (req, res) => {
  const { role } = req.body;
  if (!['Ranger', 'Administrator'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role',
      [role, req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/users/:id — admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;