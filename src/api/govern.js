'use strict';

const express = require('express');

function createGovernRouter(govern) {
  const router = express.Router();

  router.get('/miniapps', (_req, res) => {
    res.json({ items: govern.listMiniapps() });
  });

  router.get('/centres', (_req, res) => {
    res.json({ items: govern.listCentres() });
  });

  router.post('/centres', (req, res) => {
    res.status(201).json(govern.createCentre(req.body));
  });

  router.put('/centres/:id', (req, res) => {
    res.json(govern.updateCentre(req.params.id, req.body));
  });

  router.get('/employees', (_req, res) => {
    res.json({ items: govern.listEmployees() });
  });

  router.post('/employees', (req, res) => {
    res.status(201).json(govern.createEmployee(req.body));
  });

  router.put('/employees/:id', (req, res) => {
    res.json(govern.updateEmployee(req.params.id, req.body));
  });

  return router;
}

module.exports = { createGovernRouter };
