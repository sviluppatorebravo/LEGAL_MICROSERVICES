# Scadenze

## Descrizione
Calendario centralizzato di tutte le scadenze legali: contratti, polizze, adempimenti, udienze, depositi.
Alert automatici e vista calendario.

## Servizio
- **Progetto**: `src/LEGAL.Scadenze.Api/` (da creare)
- **Porta**: 5224
- **Database**: `data/scadenze.db`
- **Gateway**: `/api/scadenze/{**catch-all}` (routing gia configurato)

## Stato: DA IMPLEMENTARE
Il routing gateway e' gia configurato. Gli enum sono gia definiti in LEGAL.Shared.

## Funzionalita previste
- CRUD scadenze con priorita e stato
- Vista calendario mensile
- Lista prossime scadenze (configurabile per giorni)
- Lista scadenze non completate oltre la data
- Alert automatici via NOTIFICATION_SERVICE
- Collegamento a entita di riferimento (contratto, contenzioso, adempimento)
- Statistiche

## Modello Dati previsto
### Scadenza
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Tipo | TipoScadenza | ContrattoScadenza, RinnovoPolizza, Adempimento, UdienzaProcesso, Deposito, Altro |
| Titolo | string | Descrizione scadenza |
| Descrizione | string? | Dettagli |
| DataScadenza | DateTime | Data scadenza |
| Priorita | PrioritaScadenza | Alta, Media, Bassa |
| Stato | StatoScadenza | Pendente, InCorso, Completata, Scaduta |
| EntitaRiferimento | string? | Tipo entita collegata |
| EntitaId | Guid? | Id entita collegata |
| ResponsabileId | string? | Referente |

## Endpoint previsti
| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/scadenze` | Lista scadenze |
| GET | `/api/scadenze/{id}` | Dettaglio |
| POST | `/api/scadenze` | Crea scadenza |
| PUT | `/api/scadenze/{id}` | Aggiorna |
| DELETE | `/api/scadenze/{id}` | Soft delete |
| GET | `/api/scadenze/calendario` | Vista calendario (mese, anno) |
| GET | `/api/scadenze/prossime` | Prossime N giorni |
| GET | `/api/scadenze/scadute` | Scadenze non completate |
| GET | `/api/scadenze/statistiche` | Statistiche |
