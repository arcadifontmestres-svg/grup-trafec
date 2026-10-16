'use strict';
const crypto=require('crypto');
function createMagatzemService(store){
 const rows=()=>store.read().products||[];
 const families=()=>[...new Set(rows().map(p=>p.family).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ca'));
 function list({family='',q=''}={}){return rows().filter(p=>(!family||p.family===family)&&(!q||p.name.toLocaleLowerCase('ca').includes(q.toLocaleLowerCase('ca'))));}
 function save(input){
  const name=String(input?.name||'').trim();
  if(!name){const e=new Error('Cal indicar el producte');e.status=400;throw e;}
  const min=Number(input?.min??0);
  const price=Number(input?.price??0);
  if(!Number.isFinite(price)||price<0){const e=new Error('Preu no vàlid');e.status=400;throw e;}
  if(!Number.isFinite(min)||min<0){const e=new Error('Estoc mínim no vàlid');e.status=400;throw e;}
  let saved;
  store.update(data=>{
   if(!Array.isArray(data.products))data.products=[];
   const existing=input.id?data.products.find(p=>p.id===input.id):null;
   if(input.id&&!existing){const e=new Error('Producte no trobat');e.status=404;throw e;}
   const now=new Date().toISOString();
   saved={...existing,id:existing?.id||'product_'+crypto.randomUUID(),name,family:String(input.family??existing?.family??''),unit:String(input.unit??existing?.unit??'unitat'),min,price,active:input.active!==false,updatedAt:now};
   if(existing)Object.assign(existing,saved);else data.products.push(saved);
  });
  return saved;
 }
 function stock(centerId){const movements=store.read().stockMovements||[];const totals={};for(const m of movements){if(m.centerId!==centerId)continue;totals[m.productId]=(totals[m.productId]||0)+Number(m.delta||0)}return totals;}
 function receive(centerId,input){
  const product=rows().find(p=>p.id===input?.productId);
  const quantity=Number(input?.quantity);
  const lot=String(input?.lot||'').trim(),supplier=String(input?.supplier||'').trim(),requestId=String(input?.requestId||'').trim();
  if(!product||!Number.isFinite(quantity)||quantity<=0||!lot||!supplier||!requestId){const e=new Error('Recepció incompleta');e.status=400;throw e;}
  let saved;
  store.update(data=>{
   if(!Array.isArray(data.stockMovements))data.stockMovements=[];
   if(!Array.isArray(data.appccReceptions))data.appccReceptions=[];
   saved=data.stockMovements.find(m=>m.centerId===centerId&&m.requestId===requestId);
   if(saved){if(saved.productId!==product.id||saved.delta!==quantity||saved.lot!==lot||saved.supplier!==supplier){const e=new Error('Identificador de recepció reutilitzat');e.status=409;throw e;}return;}
   const now=new Date().toISOString();
   saved={id:'movement_'+crypto.randomUUID(),centerId,requestId,productId:product.id,productName:product.name,delta:quantity,unit:product.unit,lot,supplier,expiry:String(input.expiry||''),createdAt:now};
   data.stockMovements.push(saved);
   data.appccReceptions.push({id:'appcc_'+crypto.randomUUID(),centerId,sourceId:saved.id,productId:product.id,lot,supplier,quantity,unit:product.unit,expiry:saved.expiry,createdAt:now});
  });
  return saved;
 }
 return {list,families,save,stock,receive};
}
module.exports={createMagatzemService};
