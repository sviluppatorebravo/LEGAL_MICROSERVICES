# Feature 7 - Analisi Rischio

> Risk scoring per contratti, checklist di compliance e verifiche audit.
> Versione: 0.1.0 | Data: 2026-03-29

---

## Panoramica

Il servizio Analisi Rischio valuta il livello di rischio associato a contratti e operazioni legali. Fornisce risk scoring automatico, checklist di compliance configurabili e gestione delle verifiche di audit con tracciamento risultati.

## Servizio Backend

- **Progetto**: `src/LEGAL.AnalisiRischio.Api/`
- **Porta**: 5228
- **Database**: `data/analisi-rischio.db`
- **Gateway**: `/api/analisi-rischio/{**catch-all}`

## Modello Dati

### analisi_rischio
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | int | Identificativo univoco |
| ContrattoId | int? | Riferimento al contratto analizzato |
| Titolo | string | Titolo dell'analisi |
| Descrizione | string? | Descrizione del contesto |
| ScoreRischio | decimal | Punteggio di rischio (0-100) |
| Livello | string | Basso, Medio, Alto, Critico |
| Note | string? | Note aggiuntive |
| Status | string | Stato del record |
| CreatedAt | datetime | Data creazione |
| UpdatedAt | datetime | Data aggiornamento |

### checklist_compliance
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | int | Identificativo univoco |
| AnalisiRischioId | int | Riferimento all'analisi |
| Voce | string | Voce della checklist |
| Descrizione | string? | Descrizione della voce |
| Esito | string | Conforme, NonConforme, NonApplicabile |
| Note | string? | Note |
| VerificatoDa | string? | Utente che ha verificato |
| VerificatoAt | datetime? | Data verifica |

### verifiche_compliance
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | int | Identificativo univoco |
| AnalisiRischioId | int | Riferimento all'analisi |
| Tipo | string | Tipo di verifica (Audit, Ispezione, Revisione) |
| Esito | string | Superata, NonSuperata, InCorso |
| DataVerifica | datetime | Data della verifica |
| Verificatore | string? | Chi ha eseguito la verifica |
| Risultati | string? | Dettaglio risultati |
| Note | string? | Note aggiuntive |

## Endpoint API

| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/analisi-rischio` | Lista analisi rischio (paginata, filtrabile) |
| GET | `/api/analisi-rischio/{id}` | Dettaglio analisi |
| POST | `/api/analisi-rischio` | Crea analisi rischio |
| PUT | `/api/analisi-rischio/{id}` | Aggiorna analisi |
| DELETE | `/api/analisi-rischio/{id}` | Soft delete |
| GET | `/api/analisi-rischio/contratto/{id}` | Analisi per contratto |
| GET | `/api/analisi-rischio/{id}/checklist` | Checklist compliance |
| POST | `/api/analisi-rischio/{id}/checklist` | Aggiungi voce checklist |
| PUT | `/api/analisi-rischio/checklist/{id}` | Aggiorna voce checklist |
| GET | `/api/analisi-rischio/{id}/verifiche` | Verifiche per analisi |
| POST | `/api/analisi-rischio/{id}/verifiche` | Registra verifica |
| PUT | `/api/analisi-rischio/verifiche/{id}` | Aggiorna verifica |

## Riferimenti

- [Contratti](1_contratti.md) - Contratti analizzati
- [Compliance](3_compliance.md) - Adempimenti normativi collegati
- [AI](6_ai.md) - Analisi rischio assistita da AI
