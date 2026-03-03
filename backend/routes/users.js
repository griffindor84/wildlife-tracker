const express = require('express');
const db = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users  (admin only)
router.get('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const users = db.prepare('SELECT id, name, email, role, joinDate FROM users').all();
  res.json(users);
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const result = db.prepare('DELETE FROM users WHERE id = ?').run(Number(req.params.id));
  if (result.changes === 0) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted' });
});

module.exports = router;

