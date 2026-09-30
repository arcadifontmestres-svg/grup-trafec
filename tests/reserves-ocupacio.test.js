'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { createStore } = require('../src/dades/store');
const { createCrmService } = require('../src/funcions/crm');
const { createReservationService } = require('../src/funcions/reserves');
const { createCommercialService, STATUS: COMMERCIAL_STATUS } = require('../src/funcions/comercial');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'grup-trafec-reserves-'));
const file = path.join(dir, 'data.json');

let store = createStore(file);
let crm = createCrmService(store);
let reservations = createReservationService(store);
let commercial = createCommercialService(store, crm, reservations);

const manual = reservations.create({
  date: '2026-10-10', time: '21:00', pax: 4, name: 'Reserva Manual',
  phone: '600000001', source: 'MANUAL', status: reservations.status.CONFIRMED
});
assert.ok(manual.code.startsWith('RES-'));

const proposal = commercial.create({
  clientName: 'Grup Comercial', clientPhone: '600000002',
  eventDate: '2026-10-10', eventTime: '20:30', pax: 35,
  menuName: 'Menú grup', pricePerPerson: 50
});
commercial.setStatus(proposal.id, COMMERCIAL_STATUS.REVIEW);
commercial.setStatus(proposal.id, COMMERCIAL_STATUS.VALIDATED);
commercial.setStatus(proposal.id, COMMERCIAL_STATUS.SENT);
const accepted = commercial.setStatus(proposal.id, COMMERCIAL_STATUS.ACCEPTED);
assert.ok(accepted.reservationId);

const fromCommercial = reservations.findByCommercialProposal(proposal.id);
assert.ok(fromCommercial);
assert.equal(fromCommercial.pax, 35);
assert.equal(fromCommercial.source, 'COMERCIAL');

const occupancy = reservations.occupancy({ dateFrom: '2026-10-10', dateTo: '2026-10-10' });
assert.equal(occupancy.totals.confirmed, 2);
assert.equal(occupancy.totals.paxConfirmed, 39);

reservations.update(manual.id, { pax: 5 });
reservations.createBlock({ date: '2026-10-10', time: '22:30', reason: 'Bloqueig intern' });

store = createStore(file);
reservations = createReservationService(store);
const reloaded = reservations.occupancy({ dateFrom: '2026-10-10', dateTo: '2026-10-10' });
assert.equal(reloaded.totals.paxConfirmed, 40);
assert.equal(reloaded.blocks.length, 1);

fs.rmSync(dir, { recursive: true, force: true });
console.log('OK · Reserves + Comercial → Agenda/Ocupació única → recarrega');
