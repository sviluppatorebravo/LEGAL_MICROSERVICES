# Integrazione con Servizi Esistenti

## Principio
Ogni dominio comunica con gli altri **esclusivamente tramite l'Enterprise Gateway** (porta 5001).
Non si effettuano mai chiamate dirette `localhost:<porta>` tra domini diversi.

Configurazione nel `.env`:
```
ENTERPRISE_GATEWAY_URL=http://localhost:5001
```

## Servizi Infrastrutturali (diretti)
| Servizio | Porta | Utilizzo |
|----------|-------|----------|
| NOTIFICATION_SERVICE | 5010 | Notifiche scadenze, alert compliance, promemoria udienze |
| CRON_SCHEDULER | 5011 | Check periodico scadenze, rinnovi automatici |

## Integrazioni in Uscita (Legal -> altri domini)

### Legal -> DMS (Document Management)
- Archiviazione documenti contrattuali, allegati, versioni firmate
- `POST {ENTERPRISE_GATEWAY_URL}/api/dms/documenti`

### Legal -> HRM (Human Resources)
- Associare contratti di lavoro ai dipendenti, clausole non-compete
- `POST {ENTERPRISE_GATEWAY_URL}/api/hrm/contratti-lavoro`

### Legal -> ERP (Enterprise Resource Planning)
- Impatto contabile dei contratti (costi, ricavi, ammortamenti)
- `POST {ENTERPRISE_GATEWAY_URL}/api/erp/registrazioni`

### Legal -> FIN (Finance)
- Costi legali, budget contenzioso, fatture consulenti esterni
- `POST {ENTERPRISE_GATEWAY_URL}/api/fin/costi-legali`

## Integrazioni in Entrata (altri domini -> Legal)

### HRM -> Legal
- Richiesta nuovo contratto di lavoro per assunzione
- `POST /api/contratti` (con tipo=Lavoro)

### SCM (Supply Chain) -> Legal
- Richiesta contratto fornitore o NDA
- `POST /api/contratti` (con tipo=Fornitura o NDA)

### ECOMMERCE -> Legal
- Gestione termini di servizio, privacy policy
- `GET /api/contratti?tipo=Publishing`

## Gestione Errori
Se un servizio non e' disponibile, l'Enterprise Gateway restituisce `SERVICE_UNAVAILABLE`.
Il microservizio Legal logga l'errore e continua l'operazione locale.
Un job CRON puo' ritentare la sincronizzazione quando il servizio torna disponibile.
