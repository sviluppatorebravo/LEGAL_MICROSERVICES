using LEGAL.Shared.Models;
namespace LEGAL.AnalisiRischio.Api.Models;
public class AnalisiRischio:BaseEntity{public Guid ContrattoId{get;set;}public double ScoreRischio{get;set;}public string Livello{get;set;}="Basso";public string? ClausoleRischiose{get;set;}public string? Raccomandazioni{get;set;}public string? AnalizzatoDa{get;set;}public DateTime DataAnalisi{get;set;}=DateTime.UtcNow;}
public class ChecklistCompliance:BaseEntity{public string Nome{get;set;}="";public string Categoria{get;set;}="Contrattuale";public string? Items{get;set;}}
public class VerificaCompliance:BaseEntity{public Guid ChecklistId{get;set;}public Guid ContrattoId{get;set;}public string? Risultato{get;set;}public double Completamento{get;set;}public string? VerificatoDa{get;set;}public DateTime DataVerifica{get;set;}=DateTime.UtcNow;}
public class AnalizzaContrattoRequest{public Guid ContrattoId{get;set;}public string? Contenuto{get;set;}public string? AnalizzatoDa{get;set;}}
public class CreateChecklistRequest{public string Nome{get;set;}="";public string Categoria{get;set;}="Contrattuale";public string? Items{get;set;}}
public class UpdateChecklistRequest:CreateChecklistRequest{}
public class CreateVerificaRequest{public Guid ChecklistId{get;set;}public Guid ContrattoId{get;set;}public string? Risultato{get;set;}public double Completamento{get;set;}public string? VerificatoDa{get;set;}}
