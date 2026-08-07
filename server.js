const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const eventRoutes = require('./server/src/routes/eventRoutes');
const authRoutes = require('./server/src/routes/authRoutes');
const profileRoutes = require('./server/src/routes/profileRoutes');
const searchRoutes = require('./server/src/routes/searchRoutes');
const venueRoutes = require('./server/src/routes/venueRoutes');
const connectDB = require('./server/src/config/db');

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Attempt DB connection non-blockingly
  connectDB();

  app.use(cors());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/profiles', profileRoutes);
  app.use('/api/search', searchRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/venues', venueRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'SensorySpaces', time: new Date().toISOString() });
  });

  // Vite Middleware for Dev Mode
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = require('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error('[AI Server Error]:', err.message);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({
      message: err.message || 'Internal server error'
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SensorySpaces full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
