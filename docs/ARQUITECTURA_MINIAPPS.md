# Arquitectura miniapps — criteri 2026-10-03

## Principi

GRUP TRÀFEC funciona com un ecosistema de miniapps funcionals autònomes.

L'app **Gestió Grup Tràfec** és una miniapp de govern i configuració. Des d'aquesta app es creen centres, empleats i s'assignen les miniapps disponibles a cada centre.

## Menú de Gestió Grup Tràfec

- Front Office
- Back Office
- RRHH
- Configuració

Les eines concretes es connecten dins d'aquests apartats. El menú no pressuposa que existeixin centres, empleats, clients o altres dades.

## Configuració

Configuració ha de permetre, com a mínim:

- crear un centre nou;
- crear un empleat nou;
- activar o desactivar miniapps per centre;
- definir permisos i accés.

## Regla de dades

No es creen centres, empleats, clients ni registres de prova per defecte. Les dades només existeixen quan l'usuari les crea o quan provenen d'una eina real connectada.

## Miniapps

Una miniapp conserva la seva funció pròpia i pot ser utilitzada per diferents centres. Per exemple, Reserves és l'eina de reserves; no s'inventa una base de clients paral·lela si aquesta dada no existeix a l'eina.
