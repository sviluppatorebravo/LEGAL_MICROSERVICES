using LEGAL.Modello231.Api.Models;using LEGAL.Modello231.Api.Repositories;using LEGAL.Shared.Models;using LEGAL.Shared.Enums;
namespace LEGAL.Modello231.Api.Services;
public interface IModello231Service{Task<PagedResult<ModelloOrganizzativo>> GetModelliAsync(int p,int ps,string? s,int? stato);Task<ModelloOrganizzativo?> GetModelloByIdAsync(Guid id);Task<ModelloOrganizzativo?> GetModelloVigenteAsync();Task<ModelloOrganizzativo> CreateModelloAsync(CreateModelloRequest r);Task<ModelloOrganizzativo?> UpdateModelloAsync(Guid id,UpdateModelloRequest r);Task<bool> DeleteModelloAsync(Guid id);
Task<PagedResult<AreaRischio231>> GetAreeRischioAsync(int p,int ps,string? s,int? tipo);Task<AreaRischio231?> GetAreaRischioByIdAsync(Guid id);Task<List<AreaRischio231>> GetAreeRischioMatriceAsync();Task<List<AreaRischio231>> GetAreeRischioCriticheAsync();Task<AreaRischio231> CreateAreaRischioAsync(CreateAreaRischioRequest r);Task<AreaRischio231?> UpdateAreaRischioAsync(Guid id,UpdateAreaRischioRequest r);Task<bool> DeleteAreaRischioAsync(Guid id);
Task<PagedResult<Protocollo231>> GetProtocolliAsync(int p,int ps,string? s,int? tipo);Task<Protocollo231?> GetProtocolloByIdAsync(Guid id);Task<List<Protocollo231>> GetProtocolliScadutiAsync();Task<List<Protocollo231>> GetProtocolliByAreaAsync(Guid areaId);Task<Protocollo231> CreateProtocolloAsync(CreateProtocolloRequest r);Task<Protocollo231?> UpdateProtocolloAsync(Guid id,UpdateProtocolloRequest r);Task<bool> DeleteProtocolloAsync(Guid id);
Task<PagedResult<FlussoInformativoODV>> GetFlussiAsync(int p,int ps,string? s,int? tipo);Task<FlussoInformativoODV?> GetFlussoByIdAsync(Guid id);Task<List<FlussoInformativoODV>> GetFlussiInEsameAsync();Task<FlussoInformativoODV> CreateFlussoAsync(CreateFlussoODVRequest r);Task<FlussoInformativoODV?> UpdateFlussoAsync(Guid id,UpdateFlussoODVRequest r);Task<FlussoInformativoODV?> EsaminaFlussoAsync(Guid id,EsaminaFlussoRequest r);Task<bool> DeleteFlussoAsync(Guid id);
Task<PagedResult<VerificaODV>> GetVerificheAsync(int p,int ps);Task<VerificaODV?> GetVerificaByIdAsync(Guid id);Task<List<VerificaODV>> GetVerificheProssimeAsync();Task<List<VerificaODV>> GetVerificheNonConformiAsync();Task<VerificaODV> CreateVerificaAsync(CreateVerificaODVRequest r);Task<bool> DeleteVerificaAsync(Guid id);
Task<object> GetDashboardAsync();}
public class Modello231Service:IModello231Service{private readonly Modello231Repository _r;public Modello231Service(Modello231Repository r)=>_r=r;
// Modello
public async Task<PagedResult<ModelloOrganizzativo>> GetModelliAsync(int p,int ps,string? s,int? stato){var items=await _r.GetModelliAsync(p,ps,s,stato);var total=await _r.CountModelliAsync(s,stato);return new PagedResult<ModelloOrganizzativo>{Items=items,TotalCount=total,Page=p,PageSize=ps};}
public Task<ModelloOrganizzativo?> GetModelloByIdAsync(Guid id)=>_r.GetModelloByIdAsync(id);
public Task<ModelloOrganizzativo?> GetModelloVigenteAsync()=>_r.GetModelloVigenteAsync();
public async Task<ModelloOrganizzativo> CreateModelloAsync(CreateModelloRequest r){var e=new ModelloOrganizzativo{Versione=r.Versione,Titolo=r.Titolo,DataAdozione=r.DataAdozione,DataUltimaRevisione=r.DataUltimaRevisione,ODV=r.ODV,Stato=r.Stato,Allegati=r.Allegati};return await _r.CreateModelloAsync(e);}
public async Task<ModelloOrganizzativo?> UpdateModelloAsync(Guid id,UpdateModelloRequest r){var e=await _r.GetModelloByIdAsync(id);if(e==null)return null;e.Versione=r.Versione;e.Titolo=r.Titolo;e.DataAdozione=r.DataAdozione;e.DataUltimaRevisione=r.DataUltimaRevisione;e.ODV=r.ODV;e.Stato=r.Stato;e.Allegati=r.Allegati;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateModelloAsync(e);return e;}
public Task<bool> DeleteModelloAsync(Guid id)=>_r.DeleteModelloAsync(id);
// Aree Rischio
public async Task<PagedResult<AreaRischio231>> GetAreeRischioAsync(int p,int ps,string? s,int? tipo){var items=await _r.GetAreeRischioAsync(p,ps,s,tipo);var total=await _r.CountAreeRischioAsync(s,tipo);return new PagedResult<AreaRischio231>{Items=items,TotalCount=total,Page=p,PageSize=ps};}
public Task<AreaRischio231?> GetAreaRischioByIdAsync(Guid id)=>_r.GetAreaRischioByIdAsync(id);
public Task<List<AreaRischio231>> GetAreeRischioMatriceAsync()=>_r.GetAreeRischioMatriceAsync();
public Task<List<AreaRischio231>> GetAreeRischioCriticheAsync()=>_r.GetAreeRischioCriticheAsync();
public async Task<AreaRischio231> CreateAreaRischioAsync(CreateAreaRischioRequest r){var e=new AreaRischio231{ModelloId=r.ModelloId,Area=r.Area,Reato=r.Reato,TipoReato=r.TipoReato,Probabilita=r.Probabilita,Impatto=r.Impatto,LivelloRischio=r.LivelloRischio,MisurePreventive=r.MisurePreventive,ProtocolliControllo=r.ProtocolliControllo,Responsabile=r.Responsabile,UltimaValutazione=r.UltimaValutazione};return await _r.CreateAreaRischioAsync(e);}
public async Task<AreaRischio231?> UpdateAreaRischioAsync(Guid id,UpdateAreaRischioRequest r){var e=await _r.GetAreaRischioByIdAsync(id);if(e==null)return null;e.ModelloId=r.ModelloId;e.Area=r.Area;e.Reato=r.Reato;e.TipoReato=r.TipoReato;e.Probabilita=r.Probabilita;e.Impatto=r.Impatto;e.LivelloRischio=r.LivelloRischio;e.MisurePreventive=r.MisurePreventive;e.ProtocolliControllo=r.ProtocolliControllo;e.Responsabile=r.Responsabile;e.UltimaValutazione=r.UltimaValutazione;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateAreaRischioAsync(e);return e;}
public Task<bool> DeleteAreaRischioAsync(Guid id)=>_r.DeleteAreaRischioAsync(id);
// Protocolli
public async Task<PagedResult<Protocollo231>> GetProtocolliAsync(int p,int ps,string? s,int? tipo){var items=await _r.GetProtocolliAsync(p,ps,s,tipo);var total=await _r.CountProtocolliAsync(s,tipo);return new PagedResult<Protocollo231>{Items=items,TotalCount=total,Page=p,PageSize=ps};}
public Task<Protocollo231?> GetProtocolloByIdAsync(Guid id)=>_r.GetProtocolloByIdAsync(id);
public Task<List<Protocollo231>> GetProtocolliScadutiAsync()=>_r.GetProtocolliScadutiAsync();
public Task<List<Protocollo231>> GetProtocolliByAreaAsync(Guid areaId)=>_r.GetProtocolliByAreaAsync(areaId);
public async Task<Protocollo231> CreateProtocolloAsync(CreateProtocolloRequest r){var e=new Protocollo231{AreaRischioId=r.AreaRischioId,Nome=r.Nome,Descrizione=r.Descrizione,Tipo=r.Tipo,Frequenza=r.Frequenza,Responsabile=r.Responsabile,Stato=r.Stato,UltimaVerifica=r.UltimaVerifica};return await _r.CreateProtocolloAsync(e);}
public async Task<Protocollo231?> UpdateProtocolloAsync(Guid id,UpdateProtocolloRequest r){var e=await _r.GetProtocolloByIdAsync(id);if(e==null)return null;e.AreaRischioId=r.AreaRischioId;e.Nome=r.Nome;e.Descrizione=r.Descrizione;e.Tipo=r.Tipo;e.Frequenza=r.Frequenza;e.Responsabile=r.Responsabile;e.Stato=r.Stato;e.UltimaVerifica=r.UltimaVerifica;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateProtocolloAsync(e);return e;}
public Task<bool> DeleteProtocolloAsync(Guid id)=>_r.DeleteProtocolloAsync(id);
// Flussi ODV
public async Task<PagedResult<FlussoInformativoODV>> GetFlussiAsync(int p,int ps,string? s,int? tipo){var items=await _r.GetFlussiAsync(p,ps,s,tipo);var total=await _r.CountFlussiAsync(s,tipo);return new PagedResult<FlussoInformativoODV>{Items=items,TotalCount=total,Page=p,PageSize=ps};}
public Task<FlussoInformativoODV?> GetFlussoByIdAsync(Guid id)=>_r.GetFlussoByIdAsync(id);
public Task<List<FlussoInformativoODV>> GetFlussiInEsameAsync()=>_r.GetFlussiInEsameAsync();
public async Task<FlussoInformativoODV> CreateFlussoAsync(CreateFlussoODVRequest r){var e=new FlussoInformativoODV{Tipo=r.Tipo,Segnalante=r.Segnalante,Descrizione=r.Descrizione,Urgenza=r.Urgenza,Allegati=r.Allegati,Stato=r.Stato,RispostaODV=r.RispostaODV,DataRisposta=r.DataRisposta};return await _r.CreateFlussoAsync(e);}
public async Task<FlussoInformativoODV?> UpdateFlussoAsync(Guid id,UpdateFlussoODVRequest r){var e=await _r.GetFlussoByIdAsync(id);if(e==null)return null;e.Tipo=r.Tipo;e.Segnalante=r.Segnalante;e.Descrizione=r.Descrizione;e.Urgenza=r.Urgenza;e.Allegati=r.Allegati;e.Stato=r.Stato;e.RispostaODV=r.RispostaODV;e.DataRisposta=r.DataRisposta;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateFlussoAsync(e);return e;}
public async Task<FlussoInformativoODV?> EsaminaFlussoAsync(Guid id,EsaminaFlussoRequest r){var e=await _r.GetFlussoByIdAsync(id);if(e==null)return null;e.RispostaODV=r.RispostaODV;e.Stato=r.NuovoStato;e.DataRisposta=DateTime.UtcNow;e.UpdatedAt=DateTime.UtcNow;await _r.UpdateFlussoAsync(e);return e;}
public Task<bool> DeleteFlussoAsync(Guid id)=>_r.DeleteFlussoAsync(id);
// Verifiche ODV
public async Task<PagedResult<VerificaODV>> GetVerificheAsync(int p,int ps){var items=await _r.GetVerificheAsync(p,ps);var total=await _r.CountVerificheAsync();return new PagedResult<VerificaODV>{Items=items,TotalCount=total,Page=p,PageSize=ps};}
public Task<VerificaODV?> GetVerificaByIdAsync(Guid id)=>_r.GetVerificaByIdAsync(id);
public Task<List<VerificaODV>> GetVerificheProssimeAsync()=>_r.GetVerificheProssimeAsync();
public Task<List<VerificaODV>> GetVerificheNonConformiAsync()=>_r.GetVerificheNonConformiAsync();
public async Task<VerificaODV> CreateVerificaAsync(CreateVerificaODVRequest r){var e=new VerificaODV{ProtocolloId=r.ProtocolloId,DataVerifica=r.DataVerifica,Verificatore=r.Verificatore,Esito=r.Esito,Note=r.Note,AzioniRichieste=r.AzioniRichieste,DataProssimaVerifica=r.DataProssimaVerifica};return await _r.CreateVerificaAsync(e);}
public Task<bool> DeleteVerificaAsync(Guid id)=>_r.DeleteVerificaAsync(id);
public Task<object> GetDashboardAsync()=>_r.GetDashboardAsync();}
