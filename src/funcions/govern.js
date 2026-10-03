'use strict';

const crypto = require('crypto');

const MINIAPPS = Object.freeze([
  { id: 'reserves', name: 'Reserves' },
  { id: 'fitxatges', name: 'Fitxatges' },
  { id: 'gestio_cuina', name: 'Gestió cuina' },
  { id: 'gestio_magatzem', name: 'Gestió magatzem' },
  { id: 'control_normatiu', name: 'Control normatiu / APPCC' },
  { id: 'front_office_tpv', name: 'Front Office / TPV' },
  { id: 'gestio_general', name: 'Gestió general' }
]);

const MINIAPP_IDS = new Set(MINIAPPS.map(x => x.id));

function text(value) {
  return String(value ?? '').trim();
}

function unique(values) {
  return [...new Set(Array.isArray(values) ? values.map(text).filter(Boolean) : [])];
}

function validateApps(appIds) {
  const ids = unique(appIds);
  const invalid = ids.filter(id => !MINIAPP_IDS.has(id));
  if (invalid.length) {
    const error = new Error(`Miniapp no reconeguda: ${invalid.join(', ')}`);
    error.status = 400;
    throw error;
  }
  return ids;
}

function createGovernService(store) {
  function listMiniapps() {
    return MINIAPPS.map(x => ({ ...x }));
  }

  function listCentres() {
    return store.read().centres || [];
  }

  function getCentre(id) {
    return listCentres().find(x => x.id === id) || null;
  }

  function createCentre(input = {}) {
    const name = text(input.name);
    if (!name) {
      const error = new Error('El nom del centre és obligatori.');
      error.status = 400;
      throw error;
    }
    const now = new Date().toISOString();
    const centre = {
      id: `centre_${crypto.randomUUID()}`,
      name,
      notes: text(input.notes),
      miniapps: validateApps(input.miniapps),
      active: input.active !== false,
      createdAt: now,
      updatedAt: now
    };
    store.update(data => {
      data.centres.push(centre);
      return centre;
    });
    return centre;
  }

  function updateCentre(id, input = {}) {
    return store.update(data => {
      const centre = data.centres.find(x => x.id === id);
      if (!centre) {
        const error = new Error('Centre no trobat.');
        error.status = 404;
        throw error;
      }
      if (Object.prototype.hasOwnProperty.call(input, 'name')) {
        const name = text(input.name);
        if (!name) {
          const error = new Error('El nom del centre és obligatori.');
          error.status = 400;
          throw error;
        }
        centre.name = name;
      }
      if (Object.prototype.hasOwnProperty.call(input, 'notes')) centre.notes = text(input.notes);
      if (Object.prototype.hasOwnProperty.call(input, 'miniapps')) centre.miniapps = validateApps(input.miniapps);
      if (Object.prototype.hasOwnProperty.call(input, 'active')) centre.active = Boolean(input.active);
      centre.updatedAt = new Date().toISOString();
      return centre;
    });
  }

  function listEmployees() {
    return store.read().employees || [];
  }

  function createEmployee(input = {}) {
    const name = text(input.name);
    if (!name) {
      const error = new Error('El nom de l’empleat és obligatori.');
      error.status = 400;
      throw error;
    }
    const centreIds = unique(input.centreIds);
    const existing = new Set(listCentres().map(x => x.id));
    const invalid = centreIds.filter(id => !existing.has(id));
    if (invalid.length) {
      const error = new Error('Hi ha centres assignats que no existeixen.');
      error.status = 400;
      throw error;
    }
    const now = new Date().toISOString();
    const employee = {
      id: `employee_${crypto.randomUUID()}`,
      name,
      phone: text(input.phone),
      email: text(input.email),
      role: text(input.role),
      centreIds,
      active: input.active !== false,
      createdAt: now,
      updatedAt: now
    };
    store.update(data => {
      data.employees.push(employee);
      return employee;
    });
    return employee;
  }

  function updateEmployee(id, input = {}) {
    return store.update(data => {
      const employee = data.employees.find(x => x.id === id);
      if (!employee) {
        const error = new Error('Empleat no trobat.');
        error.status = 404;
        throw error;
      }
      if (Object.prototype.hasOwnProperty.call(input, 'name')) {
        const name = text(input.name);
        if (!name) {
          const error = new Error('El nom de l’empleat és obligatori.');
          error.status = 400;
          throw error;
        }
        employee.name = name;
      }
      if (Object.prototype.hasOwnProperty.call(input, 'phone')) employee.phone = text(input.phone);
      if (Object.prototype.hasOwnProperty.call(input, 'email')) employee.email = text(input.email);
      if (Object.prototype.hasOwnProperty.call(input, 'role')) employee.role = text(input.role);
      if (Object.prototype.hasOwnProperty.call(input, 'centreIds')) {
        const centreIds = unique(input.centreIds);
        const existing = new Set(data.centres.map(x => x.id));
        if (centreIds.some(id2 => !existing.has(id2))) {
          const error = new Error('Hi ha centres assignats que no existeixen.');
          error.status = 400;
          throw error;
        }
        employee.centreIds = centreIds;
      }
      if (Object.prototype.hasOwnProperty.call(input, 'active')) employee.active = Boolean(input.active);
      employee.updatedAt = new Date().toISOString();
      return employee;
    });
  }

  return {
    listMiniapps,
    listCentres,
    getCentre,
    createCentre,
    updateCentre,
    listEmployees,
    createEmployee,
    updateEmployee
  };
}

module.exports = { createGovernService, MINIAPPS };
