'use strict';

const express = require('express');
const path = require('path');
const { createStore } = require('./dades/store');
const { createCrmService } = require('./funcions/crm');
const { createCrmRouter } = require('./api/crm');

const app = express();
const PORT = process.env.PORT || 3000;

const store = createStore();
const crm = createCrmService(store);

app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'GRUP TRÀFEC', version: '0.2.0' });
});

app.use('/api/crm', createCrmRouter(crm));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Error intern.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GRUP TRÀFEC actiu al port ${PORT}`);
  });
}

module.exports = { app, store, crm };
