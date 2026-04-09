const express = require('express');
const http = require('http');
const https = require('https');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// HTTP
http.createServer(app).listen(80);

// HTTPS
const options = {
    key: fs.readFileSync('/var/www/certs/lyra/privkey.pem'),
    cert: fs.readFileSync('/var/www/certs/lyra/fullchain.pem')
};
https.createServer(options, app).listen(443);
