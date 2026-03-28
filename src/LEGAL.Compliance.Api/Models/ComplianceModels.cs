using LEGAL.Shared.Models;using LEGAL.Shared.Enums;
namespace LEGAL.Compliance.Api.Models;
public class Adempimento:BaseEntity{public string? Normativa{get;set;}public string Titolo{get;set;}="";public string? Descrizione{get;set;}public TipoAdempimento Tipo{get;set;}public FrequenzaAdempimento Frequenza{get;set;}public DateTime? Scadenza{get;set;}public StatoAdempimento Stato{get;set;}=StatoAdempimento.InValutazione;public string? ResponsabileId{get;set;}public string? Note{get;set;}}
public class AuditCompliance:BaseEntity{public Guid AdempimentoId{get;set;}public DateTime DataAudit{get;set;}public string? Esito{get;set;}public string? Note{get;set;}public string? AuditorId{get;set;}}
public class CreateAdempimentoRequest{public string? Normativa{get;set;}public string Titolo{get;set;}="";public string? Descrizione{get;set;}public TipoAdempimento Tipo{get;set;}public FrequenzaAdempimento Frequenza{get;set;}public DateTime? Scadenza{get;set;}public StatoAdempimento Stato{get;set;}public string? ResponsabileId{get;set;}public string? Note{get;set;}}
public class UpdateAdempimentoRequest:CreateAdempimentoRequest{}
public class CreateAuditRequest{public Guid AdempimentoId{get;set;}public DateTime DataAudit{get;set;}public string? Esito{get;set;}public string? Note{get;set;}public string? AuditorId{get;set;}}
