require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');

const authRoutes          = require('./routes/auth');
const observationRoutes   = require('./routes/observations');
const reportRoutes        = require('./routes/reports');
const userRoutes          = require('./routes/users');
const wildlifeRoutes      = require('./routes/wildlife');
const imageAnalysisRoutes = require('./routes/imageAnalysis');

const app  = express();
const PORT = process.env.PORT || 5000;



// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth',          authRoutes);
app.use('/api/observations',  observationRoutes);
app.use('/api/reports',       reportRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/wildlife',      wildlifeRoutes);
app.use('/api/analyze-image', imageAnalysisRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
