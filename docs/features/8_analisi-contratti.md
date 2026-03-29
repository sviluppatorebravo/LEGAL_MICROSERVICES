# Feature 8 - Analisi Contratti

> Analisi approfondita dei contratti, estrazione e classificazione clausole, valutazione rischio per clausola.
> Versione: 0.1.0 | Data: 2026-03-29

---

## Panoramica

Il servizio Analisi Contratti esegue l'analisi strutturata dei documenti contrattuali. Estrae automaticamente le clausole rilevanti, le classifica per tipologia e assegna un livello di rischio a ciascuna clausola. Supporta l'identificazione di clausole critiche, mancanti o non standard.

## Servizio Backend

- **Progetto**: `src/LEGAL.AnalisiContratti.Api/`
- **Porta**: 5229
- **Database**: `data/analisi-contratti.db`
- **Gateway**: `/api/analisi-contratti/{**catch-all}`

## Modello Dati

### analisi_contratto
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | int | Identificativo univoco |
| ContrattoId | int? | Riferimento al contratto |
| Titolo | string | Titolo dell'analisi |
| Descrizione | string? | Descrizione |
| TestoContratto | string? | Testo completo del contratto |
| RischioGlobale | string | Basso, Medio, Alto, Critico |
| ScoreGlobale | decimal | Punteggio rischio complessivo (0-100) |
| NumeroClausole | int | Numero clausole rilevate |
| Note | string? | Note |
| Status | string | Stato del record |
| CreatedAt | datetime | Data creazione |
| UpdatedAt | datetime | Data aggiornamento |

### clausole_rilevate
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | int | Identificativo univoco |
| AnalisiContrattoId | int | Riferimento all'analisi |
| Testo | string | Testo della clausola |
| Tipo | string | Penale, Limitazione, Riservatezza, Recesso, Garanzia, Indennizzo, Altro |
| Classificazione | string | Standard, Custom, Critica, Mancante |
| LivelloRischio | string | Basso, Medio, Alto, Critico |
| ScoreRischio | decimal | Punteggio rischio clausola (0-100) |
| Posizione | int | Ordine nel contratto |
| Suggerimento | string? | Suggerimento di modifica |
| Note | string? | Note |

## Endpoint API

| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/analisi-contratti` | Lista analisi (paginata, filtrabile) |
| GET | `/api/analisi-contratti/{id}` | Dettaglio analisi con clausole |
| POST | `/api/analisi-contratti` | Crea analisi contratto |
| PUT | `/api/analisi-contratti/{id}` | Aggiorna analisi |
| DELETE | `/api/analisi-contratti/{id}` | Soft delete |
| GET | `/api/analisi-contratti/contratto/{id}` | Analisi per contratto |
| GET | `/api/analisi-contratti/{id}/clausole` | Lista clausole rilevate |
| POST | `/api/analisi-contratti/{id}/clausole` | Aggiungi clausola |
| PUT | `/api/analisi-contratti/clausole/{id}` | Aggiorna clausola |
| DELETE | `/api/analisi-contratti/clausole/{id}` | Rimuovi clausola |
| POST | `/api/analisi-contratti/{id}/analizza` | Avvia analisi automatica (estrazione clausole) |
| GET | `/api/analisi-contratti/{id}/riepilogo` | Riepilogo rischio per clausola |

## Riferimenti

- [Contratti](1_contratti.md) - Contratti da analizzare
- [Analisi Rischio](7_analisi-rischio.md) - Risk scoring collegato
- [AI](6_ai.md) - Analisi assistita da AI
