const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://boardgamestudio.com',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (React app) - these are in the same directory as server.js
app.use(express.static(path.join(__dirname)));

// API Routes - NO /api prefix since /api directory IS the website root
app.use('/projects', require('./routes/projects'));
app.use('/jobs', require('./routes/jobs'));
app.use('/events', require('./routes/events'));
app.use('/users', require('./routes/users'));
app.use('/design-diaries', require('./routes/design-diaries'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all handler: serve React app for all non-API routes
// This enables React Router to work with direct URL access
app.get('*', (req, res) => {
  // If request accepts HTML (browser navigation), serve React app
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'index.html'));
  } else {
    // If request expects JSON (API call), return 404
    res.status(404).json({ error: 'Route not found' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`BGS API Server running on port ${PORT}`);
});
