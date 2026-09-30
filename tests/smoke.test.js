'use strict';

const fs = require('fs');
const path = require('path');

const required = [
  'README.md',
  'docs/ARQUITECTURA.md',
  'docs/CRITERIS_MESTRES.md',
  'src/server.js',
  'src/govern/README.md',
  'src/funcions/README.md',
  'src/api/README.md',
  'src/dades/README.md',
  'public/index.html'
];

for (const rel of required) {
  const full = path.join(__dirname, '..', rel);
  if (!fs.existsSync(full)) throw new Error(`Falta estructura obligatòria: ${rel}`);
}

console.log('OK · estructura base GRUP TRÀFEC');
