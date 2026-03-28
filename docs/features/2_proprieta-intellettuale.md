# Proprieta Intellettuale

## Descrizione
Gestione brevetti, marchi registrati, copyright, trade secret e relative licenze.
Monitoraggio scadenze registrazioni e rinnovi.

## Servizio
- **Progetto**: `src/LEGAL.IP.Api/`
- **Porta**: 5223
- **Database**: `data/ip.db`
- **Gateway**: `/api/ip/{**catch-all}`

## Funzionalita implementate
- CRUD proprieta intellettuale con filtri (tipo, ricerca)
- Paginazione risultati
- Gestione licenze per asset IP (esclusiva, non esclusiva, sublicenza)
- Monitoraggio scadenze registrazioni
- Statistiche aggregate

## Modello Dati
### ProprietaIntellettuale
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Tipo | TipoIP | Brevetto, Marchio, Copyright, TradeSecret, Licenza |
| Titolo | string | Nome dell'asset IP |
| NumeroRegistrazione | string? | Numero registrazione ufficiale |
| Stato | StatoIP | Registrato, InRegistrazione, Scaduto, Contestato |
| Territorio | string? | Ambito territoriale (IT, EU, WIPO) |

### LicenzaIP
IPId, Licenziatario, Tipo (Esclusiva/NonEsclusiva/Sublicenza), DataInizio, DataFine, Royalty, Condizioni

## Endpoint
| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/proprietaintellettuale` | Lista paginata (search, tipo) |
| GET | `/api/proprietaintellettuale/{id}` | Dettaglio |
| POST | `/api/proprietaintellettuale` | Registra |
| PUT | `/api/proprietaintellettuale/{id}` | Aggiorna |
| DELETE | `/api/proprietaintellettuale/{id}` | Soft delete |
| GET | `/api/proprietaintellettuale/in-scadenza` | IP in scadenza |
| GET | `/api/proprietaintellettuale/statistiche` | Statistiche |
| GET | `/api/proprietaintellettuale/{ipId}/licenze` | Licenze |
| POST | `/api/proprietaintellettuale/{ipId}/licenze` | Nuova licenza |

## Da implementare
- [ ] Rinnovi automatici
- [ ] Alert scadenza via notifiche
- [ ] Portfolio view territoriale
