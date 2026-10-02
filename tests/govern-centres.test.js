'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStore } = require('../src/dades/store');
const { createGovernService } = require('../src/govern/centres');
const { createCenterLinks } = require('../src/govern/center-links');
const { createCrmService } = require('../src/funcions/crm');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grup-trafec-govern-'));
const file = path.join(dir, 'data.json');

try {
  const store = createStore(file);
  const govern = createGovernService(store);
  const links = createCenterLinks(store);
  const crm = createCrmService(store);

  const sarriera = govern.createCenter({ code: 'S1930', name: 'Sarriera 1930', type: 'Restaurant', company: 'Grup Tràfec' });
  const sitges = govern.createCenter({ code: 'SITGES', name: 'Sitges', type: 'Restaurant', company: 'Grup Tràfec' });

  assert.strictEqual(govern.listCenters().length, 2);
  assert.strictEqual(govern.getPermissions(sarriera.id).functions.crm, true);

  govern.setPermissions(sitges.id, { functions: { crm: true, commercial: false, reservations: true } });
  assert.strictEqual(govern.getPermissions(sitges.id).functions.commercial, false);

  const contactA = crm.create({ name: 'Client Sarriera' });
  const contactB = crm.create({ name: 'Client Sitges' });
  links.add('crm', contactA.id, sarriera.id);
  links.add('crm', contactB.id, sitges.id);

  assert.strictEqual(links.has('crm', contactA.id, sarriera.id), true);
  assert.strictEqual(links.has('crm', contactA.id, sitges.id), false);
  assert.strictEqual(links.has('crm', contactB.id, sitges.id), true);
  assert.strictEqual(links.has('crm', contactA.id, ''), true);

  const reopened = createStore(file);
  const governReloaded = createGovernService(reopened);
  const linksReloaded = createCenterLinks(reopened);

  assert.strictEqual(governReloaded.getCenter(sarriera.id).name, 'Sarriera 1930');
  assert.strictEqual(governReloaded.getPermissions(sitges.id).functions.commercial, false);
  assert.strictEqual(linksReloaded.has('crm', contactA.id, sarriera.id), true);

  console.log('govern-centres.test.js OK');
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
