# Contratti

## Descrizione
Gestione completa del ciclo di vita dei contratti: dalla bozza alla firma, dal rinnovo alla risoluzione.
Supporta NDA, licenze, forniture, contratti di lavoro e publishing.

## Servizio
- **Progetto**: `src/LEGAL.Contratti.Api/`
- **Porta**: 5222
- **Database**: `data/contratti.db`
- **Gateway**: `/api/contratti/{**catch-all}`

## Funzionalita implementate
- CRUD contratti con filtri (tipo, stato, ricerca testuale)
- Paginazione risultati
- Gestione clausole per contratto (Standard, Custom, Penale)
- Versioning documenti contrattuali
- Rinnovi in scadenza con configurazione giorni preavviso
- Statistiche aggregate

## Modello Dati
### Contratto
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Tipo | TipoContratto | NDA, Licenza, Fornitura, Lavoro, Publishing, Altro |
| Titolo | string | Titolo del contratto |
| ControParte | string? | Nome controparte |
| Valore | decimal? | Valore economico |
| Stato | StatoContratto | Bozza, InRevisione, Firmato, Attivo, Scaduto, Risolto |
| Rinnovo | TipoRinnovo | Automatico, Manuale, No |

### Clausola
ContrattoId, Titolo, Testo, Tipo (Standard/Custom/Penale), Ordine

### VersioneContratto
ContrattoId, Versione, FilePath, Note, CreatedBy

## Endpoint
| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/contratti` | Lista paginata (search, tipo, stato) |
| GET | `/api/contratti/{id}` | Dettaglio |
| POST | `/api/contratti` | Crea |
| PUT | `/api/contratti/{id}` | Aggiorna |
| DELETE | `/api/contratti/{id}` | Soft delete |
| GET | `/api/contratti/rinnovi-in-scadenza` | Rinnovi imminenti |
| GET | `/api/contratti/statistiche` | Statistiche |
| GET | `/api/contratti/{cid}/clausole` | Clausole contratto |
| POST | `/api/contratti/{cid}/clausole` | Aggiungi clausola |
| DELETE | `/api/contratti/clausole/{id}` | Elimina clausola |
| GET | `/api/contratti/{cid}/versioni` | Versioni documento |
| POST | `/api/contratti/{cid}/versioni` | Nuova versione |

## Da implementare
- [ ] Firma digitale (PAdES, CAdES)
- [ ] Template contratti con placeholder
- [ ] Workflow approvazione multi-livello
- [ ] Generazione PDF automatica
- [ ] Integrazione PEC
