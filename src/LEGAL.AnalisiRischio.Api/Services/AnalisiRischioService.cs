using LEGAL.AnalisiRischio.Api.Models;using LEGAL.AnalisiRischio.Api.Repositories;using LEGAL.Shared.Models;
namespace LEGAL.AnalisiRischio.Api.Services;
public interface IAnalisiRischioService{Task<Models.AnalisiRischio> AnalizzaContrattoAsync(AnalizzaContrattoRequest r);Task<List<Models.AnalisiRischio>> GetByContrattoAsync(Guid cid);Task<object> GetDashboardAsync();Task<List<Models.AnalisiRischio>> GetTrendAsync();Task<List<ChecklistCompliance>> GetChecklistsAsync();Task<ChecklistCompliance?> GetChecklistByIdAsync(Guid id);Task<ChecklistCompliance> CreateChecklistAsync(CreateChecklistRequest r);Task<ChecklistCompliance?> UpdateChecklistAsync(Guid id,UpdateChecklistRequest r);Task<bool> DeleteChecklistAsync(Guid id);Task<VerificaCompliance> CreateVerificaAsync(CreateVerificaRequest r);Task<List<VerificaCompliance>> GetVerificheByContrattoAsync(Guid cid);}
public class AnalisiRischioService:IAnalisiRischioService{private readonly AnalisiRischioRepository _r;public AnalisiRischioService(AnalisiRischioRepository r)=>_r=r;
public async Task<Models.AnalisiRischio> AnalizzaContrattoAsync(AnalizzaContrattoRequest r){
    var score=CalcolaRischio(r.Contenuto);
    var livello=score switch{>=80=>"Critico",>=60=>"Alto",>=30=>"Medio",_=>"Basso"};
    var clausole=IdentificaClausoleRischiose(r.Contenuto);
    var raccomandazioni=GeneraRaccomandazioni(livello);
    var e=new Models.AnalisiRischio{ContrattoId=r.ContrattoId,ScoreRischio=score,Livello=livello,ClausoleRischiose=clausole,Raccomandazioni=raccomandazioni,AnalizzatoDa=r.AnalizzatoDa,DataAnalisi=DateTime.UtcNow};
    return await _r.CreateAnalisiAsync(e);}
public Task<List<Models.AnalisiRischio>> GetByContrattoAsync(Guid cid)=>_r.GetByContrattoAsync(cid);
public Task<object> GetDashboardAsync()=>_r.GetDashboardAsync();
public Task<List<Models.AnalisiRischio>> GetTrendAsync()=>_r.GetTrendAsync();
public Task<List<ChecklistCompliance>> GetChecklistsAsync()=>_r.GetChecklistsAsync();
public Task<ChecklistCompliance?> GetChecklistByIdAsync(Guid id)=>_r.GetChecklistByIdAsync(id);
public async Task<ChecklistCompliance> CreateChecklistAsync(CreateChecklistRequest r){var e=new ChecklistCompliance{Nome=r.Nome,Categoria=r.Categoria,Items=r.Items};return await _r.CreateChecklistAsync(e);}
public async Task<ChecklistCompliance?> UpdateChecklistAsync(Guid id,UpdateChecklistRequest r){var e=await _r.GetChecklistByIdAsync(id);if(e==null)return null;e.Nome=r.Nome;e.Categoria=r.Categoria;e.Items=r.Items;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateChecklistAsync(e);return e;}
public Task<bool> DeleteChecklistAsync(Guid id)=>_r.DeleteChecklistAsync(id);
public async Task<VerificaCompliance> CreateVerificaAsync(CreateVerificaRequest r){var e=new VerificaCompliance{ChecklistId=r.ChecklistId,ContrattoId=r.ContrattoId,Risultato=r.Risultato,Completamento=r.Completamento,VerificatoDa=r.VerificatoDa,DataVerifica=DateTime.UtcNow};return await _r.CreateVerificaAsync(e);}
public Task<List<VerificaCompliance>> GetVerificheByContrattoAsync(Guid cid)=>_r.GetVerificheByContrattoAsync(cid);
private static double CalcolaRischio(string? contenuto){if(string.IsNullOrEmpty(contenuto))return 15;var score=10.0;var keywords=new[]{("penale",20),("esclusiva",15),("illimitata",25),("rinnovo automatico",10),("responsabilita",15),("recesso",10),("danni",15)};foreach(var(kw,s) in keywords)if(contenuto.Contains(kw,StringComparison.OrdinalIgnoreCase))score+=s;return Math.Min(100,score);}
private static string IdentificaClausoleRischiose(string? contenuto){if(string.IsNullOrEmpty(contenuto))return "Nessun contenuto analizzato";var rischi=new List<string>();if(contenuto.Contains("penale",StringComparison.OrdinalIgnoreCase))rischi.Add("Clausola penale rilevata");if(contenuto.Contains("esclusiva",StringComparison.OrdinalIgnoreCase))rischi.Add("Clausola di esclusiva");if(contenuto.Contains("illimitata",StringComparison.OrdinalIgnoreCase))rischi.Add("Responsabilita illimitata");return rischi.Count>0?string.Join("; ",rischi):"Nessuna clausola ad alto rischio";}
private static string GeneraRaccomandazioni(string livello)=>livello switch{"Critico"=>"Revisione urgente richiesta. Consultare il legale prima della firma.","Alto"=>"Negoziare le clausole rischiose. Richiedere modifiche contrattuali.","Medio"=>"Verificare le clausole evidenziate. Procedere con cautela.",_=>"Contratto nella norma. Procedere con la firma."};}
