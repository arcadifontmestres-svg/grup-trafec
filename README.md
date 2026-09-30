# GRUP TRÀFEC

Projecte central de gestió del Grup Tràfec.

## Principi rector

GRUP TRÀFEC conté i governa les funcions. Els centres no tenen còpies pròpies de les funcions: només reben permisos per utilitzar-les mitjançant interfícies satèl·lit.

## Estructura inicial

- `src/govern/` — empreses, centres, usuaris, rols, permisos, configuració i govern.
- `src/funcions/` — funcions globals del grup: CRM, Reserves, Agenda/Ocupació, Comercial/Grups, Cuina, Compres, Magatzem, APPCC, RRHH, Planning i Fitxatges.
- `src/api/` — porta única i controlada d'accés a les funcions.
- `src/dades/` — accés i model de la base de dades única.
- `public/` — interfície principal de GRUP TRÀFEC.
- `tests/` — proves funcionals i d'arquitectura.
- `docs/` — criteris mestres i arquitectura.

## Fase actual

1. Construir el nucli net de GRUP TRÀFEC.
2. Inventariar el projecte antic.
3. Portar només funcions consolidades que compleixin els criteris nous.
4. Validar cada funció abans d'incorporar la següent.
5. Només després: centres, permisos operatius i miniapps.

No es copiaran rutes, pantalles, dependències o pegats antics només perquè ja existeixin.
