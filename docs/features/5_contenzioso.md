# Contenzioso

## Descrizione
Gestione cause legali, arbitrati, controversie. Tracciamento atti processuali, udienze, timeline eventi.

## Servizio
- **Progetto**: `src/LEGAL.Contenzioso.Api/` (da creare)
- **Porta**: 5226
- **Database**: `data/contenzioso.db`
- **Gateway**: `/api/contenzioso/{**catch-all}` (routing gia configurato)

## Stato: DA IMPLEMENTARE
Il routing gateway e' gia configurato. Gli enum sono gia definiti in LEGAL.Shared.

## Modello Dati previsto
### Contenzioso
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Tipo | TipoContenzioso | Civile, Lavoro, Amministrativo, Penale, Arbitrato |
| Titolo | string | Titolo/oggetto causa |
| ControParte | string? | Parte avversa |
| NumeroFascicolo | string? | Numero RG |
| Tribunale | string? | Foro competente |
| ValoreCausa | decimal? | Valore della causa |
| Stato | StatoContenzioso | Aperto, InCorso, Sospeso, Chiuso, Vinto, Perso, Transatto |

### EventoContenzioso
ContenziosoId, Tipo, Titolo, Descrizione, Data, Esito

## Endpoint previsti
| Metodo | Path | Descrizione |
|--------|------|-------------|
| GET | `/api/contenzioso` | Lista contenziosi |
| GET | `/api/contenzioso/{id}` | Dettaglio |
| POST | `/api/contenzioso` | Crea |
| PUT | `/api/contenzioso/{id}` | Aggiorna |
| DELETE | `/api/contenzioso/{id}` | Soft delete |
| GET | `/api/contenzioso/{id}/eventi` | Atti processuali |
| POST | `/api/contenzioso/{id}/eventi` | Aggiungi evento |
| GET | `/api/contenzioso/{id}/timeline` | Timeline |
| GET | `/api/contenzioso/statistiche` | Statistiche |
