require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const observationsRoutes = require('./routes/observations');
const reportsRoutes = require('./routes/reports');
const usersRoutes = require('./routes/users');
const wildlifeRoutes = require('./routes/wildlife');
const analyzeRoutes = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Rate limiters ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// --- Middleware ---
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// --- Routes ---
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/observations', apiLimiter, observationsRoutes);
app.use('/api/reports', apiLimiter, reportsRoutes);
app.use('/api/users', apiLimiter, usersRoutes);
app.use('/api/wildlife', apiLimiter, wildlifeRoutes);
app.use('/api/analyze-image', apiLimiter, analyzeRoutes);

// --- Health check ---
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Wildlife Tracker API listening on http://localhost:${PORT}`);
});

module.exports = app;
