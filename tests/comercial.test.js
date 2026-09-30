'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStore } = require('../src/dades/store');
const { createCrmService } = require('../src/funcions/crm');
const { createCommercialService, STATUS } = require('../src/funcions/comercial');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grup-trafec-commercial-'));
const file = path.join(dir, 'data.json');

let store = createStore(file);
let crm = createCrmService(store);
let commercial = createCommercialService(store, crm);

const created = commercial.create({
  clientName: 'Empresa Prova',
  clientPhone: '600111222',
  clientEmail: 'empresa@example.com',
  eventDate: '2026-10-15',
  eventTime: '20:30',
  pax: 40,
  menuName: 'Menú grup 45',
  pricePerPerson: 45,
  notes: 'Prova comercial'
});
assert.match(created.code, /^PROP-\d{4}-0001$/);
assert.equal(created.totalAmount, 1800);
assert.equal(created.status, STATUS.DRAFT);
assert.equal(crm.list().length, 1);

store = createStore(file);
crm = createCrmService(store);
commercial = createCommercialService(store, crm);
assert.equal(commercial.get(created.id).pax, 40);

commercial.update(created.id, { pax: 42, pricePerPerson: 50 });
assert.equal(commercial.get(created.id).totalAmount, 2100);
commercial.setStatus(created.id, STATUS.REVIEW);
commercial.setStatus(created.id, STATUS.VALIDATED);
commercial.setStatus(created.id, STATUS.SENT);
commercial.setStatus(created.id, STATUS.ACCEPTED);

store = createStore(file);
crm = createCrmService(store);
commercial = createCommercialService(store, crm);
const reloaded = commercial.get(created.id);
assert.equal(reloaded.status, STATUS.ACCEPTED);
assert.equal(reloaded.pax, 42);
assert.equal(reloaded.statusHistory.length, 5);

fs.rmSync(dir, { recursive: true, force: true });
console.log('OK · Comercial crear → guardar → recarregar → editar → validar → enviar → acceptar → recarregar');
