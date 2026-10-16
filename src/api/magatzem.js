'use strict';
const express = require('express');
const { assertCenterFunction } = require('./center-access');
function createMagatzemRouter(service, govern) {
  const router = express.Router();
  function center(req) {
    const id = String(req.params.centerId || req.query.centerId || '').trim();
    if (!id) { const e = new Error('Cal identificar el centre.'); e.status = 400; throw e; }
    assertCenterFunction(govern, id, 'gestio_magatzem');
    return id;
  }
  router.get('/products', (req,res,next) => {
    try {
      center(req);
      res.json({items:service.list({family:String(req.query.family||''),q:String(req.query.q||'')}),families:service.families()});
    } catch(e){next(e);}
  });
  router.get('/stock/:centerId', (req,res,next) => {
    try {res.json({quantities:service.stock(center(req))});} catch(e){next(e);}
  });
  router.post('/receptions/:centerId', (req,res,next) => {
    try {res.status(201).json(service.receive(center(req),req.body||{}));} catch(e){next(e);}
  });
  // La modificació del catàleg mestre requereix autenticació de Direcció;
  // no es publica cap ruta d'escriptura fins que aquesta estigui implementada.
  return router;
}
module.exports = { createMagatzemRouter };
