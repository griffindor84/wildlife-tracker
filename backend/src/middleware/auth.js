const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Get user from our DB to get role and id
    const { pool } = require('./db');
    const result = await pool.query(
      'SELECT * FROM users WHERE supabase_id = $1',
      [user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'User not found in database' });
    }

    req.user = result.rows[0];
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

module.exports = authenticateToken;