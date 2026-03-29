using LEGAL.AnalisiContratti.Api.Models;using LEGAL.AnalisiContratti.Api.Repositories;using LEGAL.Shared.Models;
namespace LEGAL.AnalisiContratti.Api.Services;
public interface IAnalisiContrattiService{Task<AnalisiContratto> AnalizzaContrattoAsync(AnalizzaContrattoRequest r);Task<AnalisiContratto?> GetByIdAsync(Guid id);Task<List<AnalisiContratto>> GetByContrattoAsync(Guid cid);Task<List<AnalisiContratto>> GetRecentiAsync();Task<object> GetStatisticheRischioAsync();Task<List<AnalisiContratto>> GetContrattiRischiosiAsync();Task<List<ClausolaRilevata>> GetClausoleAsync(Guid analisiId);}
public class AnalisiContrattiService:IAnalisiContrattiService{private readonly AnalisiContrattiRepository _r;public AnalisiContrattiService(AnalisiContrattiRepository r)=>_r=r;

public async Task<AnalisiContratto> AnalizzaContrattoAsync(AnalizzaContrattoRequest r){
    var clausole=IdentificaClausole(r.Contenuto);
    var score=CalcolaRischio(clausole);
    var livello=score switch{>=80=>"Critico",>=60=>"Alto",>=30=>"Medio",_=>"Basso"};
    var mancanti=VerificaClausoleMancanti(r.Contenuto);
    var raccomandazioni=GeneraRaccomandazioni(livello,clausole,mancanti);
    var e=new AnalisiContratto{ContrattoId=r.ContrattoId,ContrattoTitolo=r.ContrattoTitolo,DataAnalisi=DateTime.UtcNow,RischioGlobale=livello,PunteggioRischio=score,ClausoleRischiose=clausole.Count(c=>c.Rischio!="Basso"),ClausoleMancanti=mancanti,Raccomandazioni=raccomandazioni,AnalizzatoDa=r.AnalizzatoDa};
    var analisi=await _r.CreateAnalisiAsync(e);
    foreach(var cl in clausole){cl.AnalisiId=analisi.Id;await _r.CreateClausolaAsync(cl);}
    return analisi;}

public Task<AnalisiContratto?> GetByIdAsync(Guid id)=>_r.GetByIdAsync(id);
public Task<List<AnalisiContratto>> GetByContrattoAsync(Guid cid)=>_r.GetByContrattoAsync(cid);
public Task<List<AnalisiContratto>> GetRecentiAsync()=>_r.GetRecentiAsync();
public Task<object> GetStatisticheRischioAsync()=>_r.GetStatisticheRischioAsync();
public Task<List<AnalisiContratto>> GetContrattiRischiosiAsync()=>_r.GetContrattiRischiosiAsync();
public Task<List<ClausolaRilevata>> GetClausoleAsync(Guid analisiId)=>_r.GetClausoleByAnalisiAsync(analisiId);

private static List<ClausolaRilevata> IdentificaClausole(string? contenuto){
    var clausole=new List<ClausolaRilevata>();
    if(string.IsNullOrEmpty(contenuto))return clausole;
    var patterns=new[]{("penale","Penale","Alto","Clausola penale rilevata"),("rinnovo","Rinnovo","Medio","Clausola di rinnovo automatico"),("recesso","Recesso","Medio","Clausola di recesso"),("riservatezza","Riservatezza","Basso","Clausola di riservatezza"),("garanzia","Garanzia","Basso","Clausola di garanzia"),("responsabilita","Responsabilita","Alto","Clausola di responsabilita"),("foro","ForoCompetente","Basso","Foro competente specificato"),("esclusiva","Altro","Alto","Clausola di esclusiva")};
    foreach(var(kw,tipo,rischio,nota) in patterns)
        if(contenuto.Contains(kw,StringComparison.OrdinalIgnoreCase))
            clausole.Add(new ClausolaRilevata{Tipo=tipo,Testo=$"Rilevata clausola: {kw}",Rischio=rischio,Note=nota,Pagina=1});
    return clausole;}

private static double CalcolaRischio(List<ClausolaRilevata> clausole){
    if(clausole.Count==0)return 10;
    var score=10.0;
    foreach(var c in clausole)score+=c.Rischio switch{"Alto"=>25,"Medio"=>15,_=>5};
    return Math.Min(100,score);}

private static int VerificaClausoleMancanti(string? contenuto){
    if(string.IsNullOrEmpty(contenuto))return 5;
    var obbligatorie=new[]{"riservatezza","recesso","garanzia","responsabilita","foro"};
    return obbligatorie.Count(o=>!contenuto.Contains(o,StringComparison.OrdinalIgnoreCase));}

private static string GeneraRaccomandazioni(string livello,List<ClausolaRilevata> clausole,int mancanti){
    var raccs=new List<string>();
    if(livello is "Critico" or "Alto")raccs.Add("Revisione legale urgente richiesta prima della firma.");
    if(clausole.Any(c=>c.Rischio=="Alto"))raccs.Add($"Negoziare {clausole.Count(c=>c.Rischio=="Alto")} clausole ad alto rischio.");
    if(mancanti>0)raccs.Add($"Aggiungere {mancanti} clausole mancanti obbligatorie.");
    if(raccs.Count==0)raccs.Add("Contratto nella norma. Procedere con la firma.");
    return string.Join(" ",raccs);}
}
