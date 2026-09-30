# Inventari de migració — GRUP TRÀFEC

## Regla
El repositori `casa-mestres-app` és una pedrera. Cap peça entra automàticament al projecte nou.
Cada element es classifica com COPIAR, ADAPTAR o DESCARTAR i només es considera incorporat quan funciona dins l'arquitectura nova de GRUP TRÀFEC.

## COPIAR / REUTILITZAR

### Dades mestres
- `products`
- `bases`
- `dishes`
- `suppliers`
- `crmContacts`
- `reservations`
- `groupEvents`
- `productionRecords`
- `productForecasts`
- `purchaseOrders`
- `goodsReceipts`
- `traceabilityRecords`
- registres APPCC útils

### Lògiques funcionals a extreure
- CRM: contactes, preferències, segmentació i notes.
- Comercial / grups: propostes i seguiment comercial.
- Reserves: una única col·lecció `reservations`; no crear agendes paral·leles.
- Cuina: plats, bases, ingredients, escandalls.
- Producció → previsió de productes / necessitats.
- RRHH: resum d'hores i acumulats, quan passi validació.

## ADAPTAR
- Runtime i persistència central.
- Context d'empresa/centre: al projecte nou el nucli és global; el centre serà només context/permisos.
- API: separar funcions globals de les futures interfícies satèl·lit.
- Govern, rols i permisos.
- Comercial: desacoblar-lo de pantalles o rutes antigues.
- Reserves avançades: mantenir la lògica sobre `reservations`, sense duplicar dades.

## DESCARTAR COM A ARQUITECTURA
- `centre.js` i qualsevol pantalla construïda com si el centre fos el nucli.
- rutes antigues `/#kitchen`, `/#arcadi-*` i navegacions equivalents.
- pegats de compatibilitat i correccions visuals temporals.
- sincronitzacions creades només per salvar l'arquitectura anterior.
- duplicats de dades o lògica per centre.
- qualsevol miniapp abans que Govern + Funcions + Permisos estiguin consolidats.

## ORDRE DE MIGRACIÓ
1. CRM
2. Comercial / Grups
3. Reserves
4. Agenda / Ocupació
5. Cuina
6. Produccions
7. Necessitats
8. Compres / Magatzem
9. APPCC
10. RRHH / Planning / Fitxatges
11. Govern de centres i permisos
12. Miniapps

## Prova obligatòria per cada funció
CREAR → GUARDAR → RECARREGAR → CONSULTAR → EDITAR → RECARREGAR

Si algun pas falla, la funció encara no està migrada.