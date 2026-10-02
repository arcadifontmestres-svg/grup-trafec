'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

for (const relative of ['../public/app.js', '../public/context.js']) {
  const file = path.join(__dirname, relative);
  new vm.Script(fs.readFileSync(file, 'utf8'), { filename: file });
}

require('./smoke.test.js');
require('./crm.test.js');
require('./comercial.test.js');
require('./reserves-ocupacio.test.js');
require('./govern-centres.test.js');

console.log('GRUP TRÀFEC tests OK');
