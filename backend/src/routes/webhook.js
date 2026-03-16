const express = require('express');
const { Webhook } = require('svix');
const { pool } = require('../middleware/db');

const router = express.Router();

// POST /api/webhook/clerk
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return res.status(500).json({ error: 'Webhook secret not configured' });
  }

  // Verify the webhook signature
  const svix_id        = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  let event;
  try {
    const wh = new Webhook(webhookSecret);
    event = wh.verify(req.body, {
      'svix-id':        svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { type, data } = event;
  console.log('Clerk webhook received:', type);

  // Handle user created
  if (type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;
    const name  = [first_name, last_name].filter(Boolean).join(' ') || email;

    try {
      await pool.query(
        `INSERT INTO users (clerk_id, name, email, password, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [id, name, email, 'clerk-managed', 'Ranger']
      );
      console.log('User synced to DB:', email);
    } catch (err) {
      console.error('Failed to sync user:', err.message);
      return res.status(500).json({ error: 'Failed to sync user' });
    }
  }

  // Handle user deleted
  if (type === 'user.deleted') {
    try {
      await pool.query('DELETE FROM users WHERE clerk_id = $1', [data.id]);
      console.log('User deleted from DB:', data.id);
    } catch (err) {
      console.error('Failed to delete user:', err.message);
    }
  }

  // Handle user updated
  if (type === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses?.[0]?.email_address;
    const name  = [first_name, last_name].filter(Boolean).join(' ') || email;

    try {
      await pool.query(
        `UPDATE users SET name = $1, email = $2 WHERE clerk_id = $3`,
        [name, email, id]
      );
      console.log('User updated in DB:', email);
    } catch (err) {
      console.error('Failed to update user:', err.message);
    }
  }

  res.json({ received: true });
});

module.exports = router;