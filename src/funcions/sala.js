'use strict';

function text(value) { return String(value ?? '').trim(); }

function normalizeTable(input = {}, index = 0) {
  const name = text(input.name || input.label || `T${index + 1}`);
  return {
    id: text(input.id) || `table_${index + 1}`,
    name,
    seats: Math.max(0, Math.trunc(Number(input.seats) || 0)),
    x: Number.isFinite(Number(input.x)) ? Number(input.x) : null,
    y: Number.isFinite(Number(input.y)) ? Number(input.y) : null
  };
}

function normalizeRoom(input = {}, index = 0) {
  return {
    id: text(input.id) || `room_${index + 1}`,
    name: text(input.name) || `Sala ${index + 1}`,
    tables: Array.isArray(input.tables) ? input.tables.map(normalizeTable) : []
  };
}

function createSalaService(store, govern) {
  if (!store) throw new Error('Sala necessita un magatzem de dades.');
  if (!govern) throw new Error('Sala necessita Govern.');

  function get(centerId) {
    if (!centerId || !govern.getCenter(centerId)) {
      const error = new Error('Centre no trobat.');
      error.status = 404;
      throw error;
    }
    const found = store.read().roomLayouts.find(item => item.centerId === centerId);
    return found || { centerId, rooms: [], updatedAt: null };
  }

  function save(centerId, input = {}) {
    if (!centerId || !govern.getCenter(centerId)) {
      const error = new Error('Centre no trobat.');
      error.status = 404;
      throw error;
    }
    const rooms = Array.isArray(input.rooms) ? input.rooms.map(normalizeRoom) : [];
    const saved = { centerId, rooms, updatedAt: new Date().toISOString() };
    store.update(data => {
      const index = data.roomLayouts.findIndex(item => item.centerId === centerId);
      if (index < 0) data.roomLayouts.push(saved);
      else data.roomLayouts[index] = saved;
    });
    return saved;
  }

  return { get, save };
}

module.exports = { createSalaService };
