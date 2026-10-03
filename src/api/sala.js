'use strict';

const express = require('express');

function createSalaRouter(sala) {
  const router = express.Router();

  router.get('/layout', (req, res, next) => {
    try {
      res.json(sala.get(String(req.query.centerId || '').trim()));
    } catch (error) { next(error); }
  });

  router.put('/layout', (req, res, next) => {
    try {
      res.json(sala.save(String(req.query.centerId || '').trim(), req.body || {}));
    } catch (error) { next(error); }
  });

  return router;
}

module.exports = { createSalaRouter };
