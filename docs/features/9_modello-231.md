# Feature 9 - Modello 231

> Gestione del Modello di Organizzazione, Gestione e Controllo ex D.Lgs 231/2001 (responsabilita amministrativa degli enti).
> Versione: 0.1.0 | Data: 2026-03-29

---

## Panoramica

Il servizio Modello 231 gestisce tutti gli aspetti del D.Lgs 231/2001 sulla responsabilita amministrativa delle persone giuridiche. Include la gestione del modello organizzativo, la mappatura delle aree di rischio reato, i protocolli di controllo, i flussi informativi verso l'Organismo di Vigilanza (ODV) e le verifiche di conformita.

## Servizio Backend

- **Progetto**: `src/LEGAL.Modello231.Api/`
- **Porta**: 5230
- **Database**: `data/modello231.db`
- **Gateway**: `/api/modello-231/{**catch-all}`, `/api/aree-rischio-231/{**catch-all}`, `/api/protocolli-231/{**catch-all}`, `/api/flussi-odv/{**catch-all}`, `/api/verifiche-odv/{**catch-all}`

## Modello Dati

### modello_organizzativo
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | TEXT PK | Identificativo univoco |
| Versione | int | Numero versione del modello |
| Titolo | string | Titolo del modello organizzativo |
| DataAdozione | DateTime? | Data di adozione formale |
| DataUltimaRevisione | DateTime? | Data ultima revisione |
| ODV | string? | Composizione Organismo di Vigilanza |
| Stato | enum | Bozza, Vigente, InRevisione, Scaduto |
| Allegati | string? | Riferimenti allegati (JSON) |

### aree_rischio_231
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | TEXT PK | Identificativo univoco |
| ModelloId | Guid | Riferimento al modello organizzativo |
| Area | string | Area aziendale a rischio |
| Reato | string | Tipologia di reato presupposto |
| TipoReato | enum | ControPubblicaAmministrazione, Societari, Sicurezza, Ambiente, Riciclaggio, CorruzioneTraprivati, Informatici, Lavoro, Tributari |
| Probabilita | int | Probabilita di accadimento (1-5) |
| Impatto | int | Impatto potenziale (1-5) |
| LivelloRischio | enum | Basso, Medio, Alto, Critico |
| MisurePreventive | string? | Misure preventive adottate |
| ProtocolliControllo | string? | Protocolli di controllo associati |
| Responsabile | string? | Responsabile dell'area |
| UltimaValutazione | DateTime? | Data ultima valutazione rischio |

### protocolli_231
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | TEXT PK | Identificativo univoco |
| AreaRischioId | Guid | Riferimento all'area di rischio |
| Nome | string | Nome del protocollo |
| Descrizione | string? | Descrizione dettagliata |
| Tipo | enum | Preventivo, Detective, Correttivo |
| Frequenza | enum | Continuo, Giornaliero, Settimanale, Mensile, Trimestrale, Annuale |
| Responsabile | string? | Responsabile del protocollo |
| Stato | enum | Attivo, InRevisione, Sospeso |
| UltimaVerifica | DateTime? | Data ultima verifica eseguita |

### flussi_informativi_odv
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | TEXT PK | Identificativo univoco |
| Tipo | enum | Segnalazione, Report, RiunioneODV, VerificaPeriodica, Altro |
| Segnalante | string? | Chi ha inviato il flusso |
| Descrizione | string? | Contenuto del flusso informativo |
| Urgenza | enum | Normale, Urgente, Critica |
| Allegati | string? | Riferimenti allegati |
| Stato | enum | Ricevuto, InEsame, Esaminato, Archiviato |
| RispostaODV | string? | Risposta dell'ODV |
| DataRisposta | DateTime? | Data della risposta |

### verifiche_odv
| Campo | Tipo | Descrizione |
|-------|------|-------------|
| Id | TEXT PK | Identificativo univoco |
| ProtocolloId | Guid | Riferimento al protocollo verificato |
| DataVerifica | DateTime | Data della verifica |
| Verificatore | string? | Chi ha eseguito la verifica |
| Esito | enum | Conforme, NonConforme, Osservazione |
| Note | string? | Note sulla verifica |
| AzioniRichieste | string? | Azioni correttive richieste |
| DataProssimaVerifica | DateTime? | Data prossima verifica programmata |

## Endpoints

### Modello Organizzativo (`/api/modello-231`)
- `GET /api/modello-231` - Lista modelli (paginata, con filtri)
- `GET /api/modello-231/{id}` - Dettaglio modello
- `GET /api/modello-231/vigente` - Modello attualmente vigente
- `POST /api/modello-231` - Crea modello
- `PUT /api/modello-231/{id}` - Aggiorna modello
- `DELETE /api/modello-231/{id}` - Elimina modello (soft delete)
- `GET /api/modello-231/dashboard` - Dashboard riepilogativa

### Aree Rischio (`/api/aree-rischio-231`)
- `GET /api/aree-rischio-231` - Lista aree rischio (paginata)
- `GET /api/aree-rischio-231/{id}` - Dettaglio area
- `GET /api/aree-rischio-231/matrice` - Matrice completa rischi
- `GET /api/aree-rischio-231/critiche` - Solo aree ad alto/critico rischio
- `POST /api/aree-rischio-231` - Crea area rischio
- `PUT /api/aree-rischio-231/{id}` - Aggiorna area
- `DELETE /api/aree-rischio-231/{id}` - Elimina area (soft delete)

### Protocolli (`/api/protocolli-231`)
- `GET /api/protocolli-231` - Lista protocolli (paginata)
- `GET /api/protocolli-231/{id}` - Dettaglio protocollo
- `GET /api/protocolli-231/scaduti` - Protocolli con verifica scaduta
- `GET /api/protocolli-231/area/{areaId}` - Protocolli per area di rischio
- `POST /api/protocolli-231` - Crea protocollo
- `PUT /api/protocolli-231/{id}` - Aggiorna protocollo
- `DELETE /api/protocolli-231/{id}` - Elimina protocollo (soft delete)

### Flussi Informativi ODV (`/api/flussi-odv`)
- `GET /api/flussi-odv` - Lista flussi (paginata)
- `GET /api/flussi-odv/{id}` - Dettaglio flusso
- `GET /api/flussi-odv/in-esame` - Flussi in fase di esame
- `POST /api/flussi-odv` - Crea flusso informativo
- `PUT /api/flussi-odv/{id}` - Aggiorna flusso
- `POST /api/flussi-odv/{id}/esamina` - Esamina e rispondi al flusso
- `DELETE /api/flussi-odv/{id}` - Elimina flusso (soft delete)

### Verifiche ODV (`/api/verifiche-odv`)
- `GET /api/verifiche-odv` - Lista verifiche (paginata)
- `GET /api/verifiche-odv/{id}` - Dettaglio verifica
- `GET /api/verifiche-odv/prossime` - Prossime verifiche programmate (30 giorni)
- `GET /api/verifiche-odv/non-conformi` - Verifiche con esito non conforme
- `POST /api/verifiche-odv` - Crea verifica
- `DELETE /api/verifiche-odv/{id}` - Elimina verifica (soft delete)
