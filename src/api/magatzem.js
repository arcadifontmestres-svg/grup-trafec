'use strict';
const express=require('express');
function createMagatzemRouter(service,govern){
 const router=express.Router();
 router.get('/products',(req,res)=>res.json({items:service.list({family:String(req.query.family||''),q:String(req.query.q||'')}),families:service.families()}));
 router.post('/products',(req,res,next)=>{try{res.status(201).json(service.save(req.body||{}))}catch(e){next(e)}});
 router.get('/stock/:centerId',(req,res,next)=>{try{if(!govern.getCenter(req.params.centerId))return res.status(404).json({error:'Centre no trobat'});res.json({quantities:service.stock(req.params.centerId)})}catch(e){next(e)}});
 router.post('/receptions/:centerId',(req,res,next)=>{try{if(!govern.getCenter(req.params.centerId))return res.status(404).json({error:'Centre no trobat'});res.status(201).json(service.receive(req.params.centerId,req.body||{}))}catch(e){next(e)}});
 return router;
}
module.exports={createMagatzemRouter};
