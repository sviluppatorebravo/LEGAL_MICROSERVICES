# AI - Assistente Legale

## Descrizione
Assistente AI per analisi contratti, valutazione rischio legale e supporto decisionale.
Multi-provider: Anthropic (Claude), OpenAI, Ollama, OpenAI-compatible.

## Servizio
- **Progetto**: `src/LEGAL.AI.Api/`
- **Porta**: 5227
- **Database**: `data/ai.db`
- **Gateway**: `/api/ai/{**catch-all}`

## Funzionalita implementate
- Chat con assistente AI legale (ask)
- Analisi automatica contratto (rischi, clausole critiche)
- Valutazione rischio legale basata su valore e tipo
- Configurazione provider AI (provider, model)

## Modello Dati
### AiRequest
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Prompt | string? | Domanda o richiesta |
| Context | string? | Contesto aggiuntivo |
| Model | string? | Modello specifico da usare |

### AnalisiContrattoRequest
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Titolo | string? | Titolo contratto |
| Descrizione | string? | Descrizione |
| Clausole | string? | Testo clausole da analizzare |

### AnalisiRischioRequest
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Titolo | string? | Titolo |
| Descrizione | string? | Descrizione situazione |
| Tipo | string? | Tipo di rischio |
| Valore | decimal? | Valore economico in gioco |

## Endpoint
| Metodo | Path | Descrizione |
|--------|------|-------------|
| POST | `/api/ai/ask` | Domanda all'assistente legale |
| GET | `/api/ai/settings` | Configurazione AI corrente |
| PUT | `/api/ai/settings` | Aggiorna configurazione |
| POST | `/api/ai/analisi-contratto` | Analisi automatica contratto |
| POST | `/api/ai/analisi-rischio` | Valutazione rischio |

## Da implementare
- [ ] Estrazione automatica clausole da PDF
- [ ] Confronto clausole tra contratti
- [ ] Suggerimento clausole mancanti
- [ ] Generazione bozze contrattuali
- [ ] Analisi sentiment comunicazioni legali
- [ ] RAG con knowledge base normativa
