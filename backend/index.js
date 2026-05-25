const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL);

// --- API ROUTES ---
app.get('/api/ping', async (req, res) => {
  await mongoose.connection.db.admin().ping();
  res.json({ mongo: 'ok' });
});

app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

// --- STATIC FILES (nur Prod) ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// --- SERVER ---
if (process.env.NODE_ENV === 'production') {
  const sslOptions = {
    key: fs.readFileSync('/var/www/certs/lyra/privkey.pem'),
    cert: fs.readFileSync('/var/www/certs/lyra/fullchain.pem'),
  };

  https.createServer(sslOptions, app).listen(443, '0.0.0.0', () => {
    console.log('HTTPS läuft auf 443');
  });

  http.createServer((req, res) => {
    const host = req.headers.host?.split(':')[0] ?? 'localhost';
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  }).listen(80, '0.0.0.0', () => {
    console.log('HTTP → HTTPS Redirect');
  });

} else {
  app.listen(3000, () => {
    console.log('Backend läuft auf http://localhost:3000');
  });
}