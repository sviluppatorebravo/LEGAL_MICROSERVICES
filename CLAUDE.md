# LEGAL_MICROSERVICES

## Panoramica
Gestione legale completa basata su microservizi .NET 10 con frontend React. Contratti, NDA, proprieta intellettuale, scadenze legali, compliance normativa e contenzioso. Integrato con NOTIFICATION_SERVICE e CRON_SCHEDULER.

## Architettura
- **Pattern**: Microservizi con API Gateway (YARP reverse proxy)
- **Backend**: .NET 10, ASP.NET Core Web API
- **Frontend**: React 18, Vite, Mantine UI 7, TypeScript
- **Database**: SQLite + Dapper (un DB per microservizio)
- **AI**: Multi-provider (Claude, OpenAI, Ollama)

## Porte
| Servizio | Porta | Descrizione |
|----------|-------|-------------|
| Gateway | 5220 | API Gateway YARP |
| Auth | 5221 | Validazione JWT da ENTERPRISE_AUTH |
| Contratti | 5222 | Gestione contratti, NDA, clausole |
| Proprieta Intellettuale | 5223 | Brevetti, marchi, copyright, licenze |
| Scadenze | 5224 | Calendario scadenze legali |
| Compliance | 5225 | Adempimenti normativi, audit |
| Contenzioso | 5226 | Cause, arbitrati, atti processuali |
| AI | 5227 | Assistente legale AI |
| Analisi Rischio | 5228 | Risk scoring, checklist compliance |
| Analisi Contratti | 5229 | Analisi automatica contratti |
| Modello 231 | 5230 | D.Lgs 231/2001 compliance organizzativa |
| Web UI | 3200 | Frontend React |

## Avvio
```bash
./universal_start.sh
./universal_stop.sh
./universal_restart.sh
```

## Comunicazione Cross-Dominio
Configurazione: `ENTERPRISE_GATEWAY_URL=http://localhost:5001` nel .env

### Integrazioni in uscita
- **DMS**: archiviazione contratti e atti processuali
- **HRM**: collegamento contratti di lavoro a dipendenti
- **ERP**: impatto finanziario contratti e contenziosi
- **FIN**: accantonamenti per contenziosi

### Integrazioni in entrata
- **HRM**: nuovo dipendente -> generazione contratto di lavoro
- **CPQ**: preventivo accettato -> generazione contratto

### Gestione servizio non disponibile
Se un dominio target non e attivo, il gateway restituisce un errore strutturato con codice `SERVICE_UNAVAILABLE`.

## Convenzioni
- Shared + Api (modelli, repository, servizio, controller nello stesso progetto Api)
- SQLite per microservizio, Serilog, Swagger
- Soft delete, Health check /api/health
