# Auditoria tècnica — GRUP TRÀFEC (16-10-2026)

## Abast verificat
Inspecció del codi del repositori `arcadifontmestres-svg/grup-trafec` a la branca `main`. No equival a una prova de producció ni a una auditoria de totes les dades de les altres aplicacions.

## Arquitectura i dades
- `src/dades/store.js`: un únic fitxer JSON seleccionable amb `DATA_FILE`. Escriptura per fitxer temporal i canvi de nom; sense base de dades transaccional, bloqueig de processos, historial d'auditoria ni estratègia de recuperació documentada.
- `src/govern/centres.js`: centres, empleats i permisos per centre; un centre nou neix sense funcions activades.
- `src/govern/center-links.js`: assignacions de registres a centres; sense aïllament per identitat d'usuari.
- `src/api/center-access.js`: permisos explícits per centre; context buit dona accés global. El servidor no autentica l'usuari que tria aquest context. **Bloquejant per a ús públic.**
- `src/api/govern.js`: altes i modificacions de centres, empleats i permisos sense autenticació de Direcció. **Bloquejant per a ús públic.**

## Estat de les funcions
| Funció | Codi central | API | Interfície | Proves |
|---|---|---|---|---|
| CRM | Sí | Sí | Sí | Test existent |
| Comercial / Grups | Sí | Sí | Sí | Test existent |
| Reserves / Ocupació | Sí | Sí | Sí | Test existent |
| Magatzem | Parcial | Parcial | Consulta i recepcions | Test afegit, execució pendent |
| APPCC | Registre de recepcions a Magatzem | Sense API pròpia | No | Parcial |
| Compres | No verificat com a funció consolidada | No | No | No |
| Cuina | No verificat com a funció consolidada | No | No | No |
| RRHH / Planning / Fitxatges | Només gestió d'empleats | Parcial | Parcial | Parcial |
| TPV | No verificat com a funció consolidada | No | No | No |

## Incidències funcionals
1. La recepció de Magatzem genera un registre APPCC en la mateixa actualització de dades i evita duplicats per `requestId`; encara falten controls sanitaris, proveïdors mestres i validacions de lots.
2. El catàleg de productes central existeix com a estructura, però els registres originals no s'han migrat ni validat.
3. L'API de Magatzem no publica modificació del catàleg mestre, pendent d'autenticació real de Direcció.
4. La configuració de permisos i l'accés global no tenen autenticació: no exposar a Internet com a sistema de producció.
5. No hi ha evidència de proves `npm test` executades en un entorn real ni de desplegament del repositori correcte.

## Criteris de sortida obligatoris
1. Identitat autenticada i autorització de Direcció i centres comprovades al servidor.
2. Dades reals migrades amb recompte, deduplicació, còpia de seguretat i validació.
3. Fluxos complets crear → guardar → recarregar → consultar → conservar per cada funció.
4. Proves d'integració de Compres → Magatzem → Cuina → APPCC, i Comercial → Reserves → Ocupació.
5. Proves de TPV, impressió, tancament de caixa i perifèrics sobre maquinari real.
6. Desplegament i persistència verificats, sense tocar les dades de Casa Mestres.

**Cap funció sense validació completa es considera finalitzada.**
