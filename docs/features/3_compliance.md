# Compliance

## Descrizione
Gestione adempimenti normativi, monitoraggio conformita, audit e reporting.
Supporta GDPR, normativa fiscale, diritto del lavoro, normativa ambientale e settoriale.

## Servizio
- **Progetto**: `src/LEGAL.Compliance.Api/` (da creare)
- **Porta**: 5225
- **Database**: `data/compliance.db`
- **Gateway**: `/api/compliance/{**catch-all}` (routing gia configurato)

## Stato: DA IMPLEMENTARE
Il routing gateway e' gia configurato. Gli enum sono gia definiti in LEGAL.Shared.

## Funzionalita previste
- CRUD adempimenti normativi
- Dashboard stato compliance per area (GDPR, fiscale, lavoro, ecc.)
- Audit log con evidenze di conformita
- Scadenze adempimenti con alert automatici
- Report conformita esportabili
- Statistiche per tipo e stato

## Modello Dati previsto
### Adempimento
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Tipo | TipoAdempimento | GDPR, FiscaleItaliano, Lavoro, Ambientale, SettorialeGaming, Altro |
| Titolo | string | Nome adempimento |
| Descrizione | string? | Descrizione dettagliata |
| Normativa | string? | Riferimento normativo (es. "Reg. UE 2016/679") |
| Frequenza | FrequenzaAdempimento | Annuale, Semestrale, Trimestrale, Mensile, UnaTantum |
| Stato | StatoAdempimento | Conforme, NonConforme, InValutazione, NonApplicabile |
| DataScadenza | DateTime? | Prossima scadenza |
| ResponsabileId | string? | Referente interno |

## Endpoint previsti
| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/compliance` | Lista adempimenti |
| GET | `/api/compliance/{id}` | Dettaglio |
| POST | `/api/compliance` | Crea adempimento |
| PUT | `/api/compliance/{id}` | Aggiorna |
| DELETE | `/api/compliance/{id}` | Soft delete |
| GET | `/api/compliance/audit` | Report audit |
| GET | `/api/compliance/dashboard` | Dashboard stato |
| GET | `/api/compliance/statistiche` | Statistiche |
