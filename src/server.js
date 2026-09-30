'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'GRUP TRÀFEC', version: '0.1.0' });
});

app.listen(PORT, () => {
  console.log(`GRUP TRÀFEC actiu al port ${PORT}`);
});
