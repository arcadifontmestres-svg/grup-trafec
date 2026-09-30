# Criteris mestres — GRUP TRÀFEC

Aquest document fixa els criteris arquitectònics del projecte. No s'han de reinterpretar durant la implementació.

## 1. Una sola font de dades mestres

GRUP TRÀFEC concentra empreses, centres, personal, permisos, configuració, visió global, anàlisi i Direcció.

Cap interfície satèl·lit crearà una base de dades paral·lela.

## 2. Direcció governa

Direcció crea identitats, assigna permisos, activa funcions i controla configuració.

Les funcions operatives s'executen segons els permisos concedits.

## 3. Funcions úniques

Una funció existeix una sola vegada al nucli del Grup.

No hi haurà `Reserves Sarriera`, `Cuina Sarriera` o `CRM Sitges` com a còpies independents. Hi haurà Reserves, Cuina i CRM globals, amb context i permisos.

## 4. Centres

Un centre és una identitat/context gestionada per Govern.

La selecció d'un centre no crea una versió nova del codi.

## 5. Agenda / Ocupació

Agenda/Ocupació serà la font única de veritat de disponibilitat i capacitat.

Reserves i Comercial són canals d'entrada. No mantenen agendes paral·leles.

## 6. Tasques i aprovacions

Tasca operativa i flux d'aprovació són objectes diferents.

Una necessitat pot generar una sol·licitud, però no es converteix automàticament en aprovació.

## 7. Miniapps

Les miniapps es definiran després de consolidar el nucli.

Seran interfícies simples, independents visualment, que consumiran funcions autoritzades del Grup per API.

No contindran còpies de la lògica central.

## 8. Regla de desenvolupament

Cap funció es considera acabada fins que passa el recorregut complet:

crear → guardar → recarregar → consultar → conservar resultat.

## 9. Regla de migració del projecte antic

El projecte antic és una pedrera, no la base arquitectònica.

Cada element es classifica com:
- COPIAR: funciona i encaixa directament.
- ADAPTAR: la lògica és bona però cal eliminar dependències antigues.
- DESCARTAR: duplica, barreja criteris, depèn de rutes antigues o no compleix l'arquitectura.
