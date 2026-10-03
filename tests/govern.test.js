'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStore } = require('../src/dades/store');
const { createGovernService } = require('../src/funcions/govern');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grup-trafec-govern-'));
const file = path.join(dir, 'data.json');
const store = createStore(file);
const govern = createGovernService(store);

assert.deepStrictEqual(govern.listCentres(), []);
assert.deepStrictEqual(govern.listEmployees(), []);

const centre = govern.createCentre({
  name: 'Centre prova',
  miniapps: ['reserves', 'gestio_cuina']
});
assert.strictEqual(centre.name, 'Centre prova');
assert.deepStrictEqual(centre.miniapps, ['reserves', 'gestio_cuina']);
assert.strictEqual(govern.listCentres().length, 1);

const employee = govern.createEmployee({
  name: 'Persona prova',
  centreIds: [centre.id]
});
assert.strictEqual(employee.name, 'Persona prova');
assert.deepStrictEqual(employee.centreIds, [centre.id]);
assert.strictEqual(govern.listEmployees().length, 1);

assert.throws(() => govern.createCentre({ name: 'X', miniapps: ['inventada'] }), /Miniapp no reconeguda/);
assert.throws(() => govern.createEmployee({ name: 'Y', centreIds: ['centre_inexistent'] }), /no existeixen/);

fs.rmSync(dir, { recursive: true, force: true });
console.log('govern.test.js OK');
