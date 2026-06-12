import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './src/api/server-app';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Port must be exactly 3000 as required by the environment reverse proxy.
const PORT = 3000;

// Host built frontend static files
app.use(express.static(path.join(__dirname, 'dist')));

// Route SPA requests to index.html, unless it is an api endpoint
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[CyberMentor Fullstack] Production server listening on http://0.0.0.0:${PORT}`);
});
