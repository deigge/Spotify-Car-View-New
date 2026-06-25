import express from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import apiRouter from './routes/api.js';

const app = express();
app.use(express.json());
app.use(cookieParser());

// API Routen
app.use('/auth', authRouter);
app.use('/api', apiRouter);

// MongoDB Verbindung
mongoose.connect(process.env.MONGO_URL);

// nur im Production Build: Frontend ausliefern
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// --- SERVER ---
if (process.env.NODE_ENV === 'production') {
  // HTTPS Zertifikat laden
  const sslOptions = {
    key: fs.readFileSync('/var/www/certs/lyra/privkey.pem'),
    cert: fs.readFileSync('/var/www/certs/lyra/fullchain.pem'),
  };

  // HTTPS Server starten
  https.createServer(sslOptions, app).listen(443, '0.0.0.0', () => {
    console.log('HTTPS läuft auf 443');
  });

  // HTTP → HTTPS Redirect
  http
    .createServer((req, res) => {
      const host = req.headers.host?.split(':')[0] ?? 'localhost';
      res.writeHead(301, { Location: `https://${host}${req.url}` });
      res.end();
    })
    .listen(80, '0.0.0.0', () => {
      console.log('HTTP → HTTPS Redirect');
    });
} else {
  // Dev Server
  app.listen(3000, () => {
    console.log('Backend läuft auf http://localhost:3000');
  });
}
