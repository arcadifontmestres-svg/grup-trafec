# Arquitectura mare — GRUP TRÀFEC

## 1. Nucli únic

GRUP TRÀFEC és el nucli de govern, dades i funcionalitat del grup.

Les funcions existeixen una sola vegada i són globals. No es creen versions per centre.

## 2. Capes

### Govern
- Empreses
- Centres
- Usuaris
- Rols
- Permisos
- Configuració
- Visió global
- Anàlisi

### Funcions globals
- CRM
- Reserves
- Agenda / Ocupació
- Comercial / Grups
- Cuina
- Productes
- Bases
- Plats
- Escandalls
- Produccions
- Necessitats
- Compres
- Magatzem
- APPCC
- RRHH
- Planning
- Fitxatges

### Dades
Una única font de dades mestres.

### API
Una única porta controlada perquè altres interfícies puguin consultar o executar funcions autoritzades.

## 3. Centres

Els centres no són aplicacions ni mòduls duplicats. Són identitats/contextos gestionats per Govern.

## 4. Miniapps

No formen part d'aquesta primera fase.

Quan el nucli estigui consolidat, les miniapps seran interfícies externes i simples que rebran permisos per executar funcions del Grup.

## 5. Regla de migració

El projecte antic és una font de peces. Cada peça només entra si:
1. correspon a una funció definida aquí;
2. no introdueix dependències antigues innecessàries;
3. passa una prova funcional;
4. respecta la base de dades i govern únics.
