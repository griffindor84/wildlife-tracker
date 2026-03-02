const express = require('express');
const { read, write } = require('../middleware/db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/users  (admin only)
router.get('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const db = read();
  const users = db.users.map(({ password: _pw, ...u }) => u);
  res.json(users);
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrator') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  const db = read();
  const idx = db.users.findIndex(u => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  db.users.splice(idx, 1);
  write(db);
  res.json({ message: 'User deleted' });
});

module.exports = router;
