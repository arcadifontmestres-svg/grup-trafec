'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStore } = require('../src/dades/store');
const { createCrmService } = require('../src/funcions/crm');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grup-trafec-crm-'));
const file = path.join(dir, 'data.json');

let store = createStore(file);
let crm = createCrmService(store);

const created = crm.create({
  name: 'Client Prova',
  phone: '600000000',
  email: 'prova@example.com',
  segment: 'Grup',
  preferences: 'Sense gluten',
  notes: 'Contacte de prova'
});
assert.ok(created.id.startsWith('crm_'));
assert.equal(crm.list().length, 1);

store = createStore(file);
crm = createCrmService(store);
const reloaded = crm.get(created.id);
assert.equal(reloaded.name, 'Client Prova');
assert.equal(reloaded.preferences, 'Sense gluten');

crm.update(created.id, { phone: '611111111', segment: 'Empresa' });
store = createStore(file);
crm = createCrmService(store);
const edited = crm.get(created.id);
assert.equal(edited.phone, '611111111');
assert.equal(edited.segment, 'Empresa');
assert.equal(edited.name, 'Client Prova');

assert.equal(crm.list({ q: 'gluten' }).length, 1);
assert.equal(crm.list({ q: 'inexistent' }).length, 0);

fs.rmSync(dir, { recursive: true, force: true });
console.log('OK · CRM crear → guardar → recarregar → editar → recarregar');
