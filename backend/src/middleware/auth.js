const jwt = require('jsonwebtoken');
const { pool } = require('./db');

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'wildlife-tracker-secret-key');

    // Get user from our DB to get role and id
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, about, avatar_url FROM users WHERE id = $1',
      [payload.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
