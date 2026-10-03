'use strict';

const express = require('express');
const path = require('path');
const { createStore } = require('./dades/store');
const { createCrmService } = require('./funcions/crm');
const { createReservationService } = require('./funcions/reserves');
const { createCommercialService } = require('./funcions/comercial');
const { createSalaService } = require('./funcions/sala');
const { createGovernService } = require('./govern/centres');
const { createCenterLinks } = require('./govern/center-links');
const { createGovernRouter } = require('./api/govern');
const { createCrmContextRouter } = require('./api/crm-context');
const { createCommercialContextRouter } = require('./api/comercial-context');
const { createReservationContextRouter } = require('./api/reserves-context');
const { createSalaRouter } = require('./api/sala');

const app = express();
const PORT = process.env.PORT || 3000;
const publicDir = path.join(__dirname, '..', 'public');

const store = createStore();
const crm = createCrmService(store);
const reservations = createReservationService(store);
const commercial = createCommercialService(store, crm, reservations);
const govern = createGovernService(store);
const links = createCenterLinks(store);
const sala = createSalaService(store, govern);

app.use(express.json({ limit: '2mb' }));
app.use(express.static(publicDir));

app.get(['/sarriera', '/sarriera/'], (_req, res) => {
  res.sendFile(path.join(publicDir, 'sarriera.html'));
});
app.get(['/miniapp/reserves', '/miniapp/reserves/'], (_req, res) => {
  res.sendFile(path.join(publicDir, 'mini-reserves.html'));
});
app.get(['/miniapp/sala', '/miniapp/sala/'], (_req, res) => {
  res.sendFile(path.join(publicDir, 'mini-sala.html'));
});

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'GRUP TRÀFEC', version: '0.8.0' });
});

app.get('/api/satellite/context/:code', (req, res, next) => {
  try {
    const center = govern.listCenters({ includeInactive: false })
      .find(item => String(item.code || '').toUpperCase() === String(req.params.code || '').toUpperCase());
    if (!center) return res.status(404).json({ error: 'Centre no trobat.' });
    res.json({ center, permissions: govern.getPermissions(center.id).functions });
  } catch (error) { next(error); }
});

app.use('/api/govern', createGovernRouter(govern));
app.use('/api/crm', createCrmContextRouter(crm, links, govern));
app.use('/api/comercial', createCommercialContextRouter(commercial, links, govern));
app.use('/api/reserves', createReservationContextRouter(reservations, links, govern));
app.use('/api/sala', createSalaRouter(sala));

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(error.status || 500).json({ error: error.message || 'Error intern.' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`GRUP TRÀFEC actiu al port ${PORT}`);
  });
}

module.exports = { app, store, crm, reservations, commercial, govern, links, sala };
