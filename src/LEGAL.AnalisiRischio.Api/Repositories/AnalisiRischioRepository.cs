using Dapper;using Microsoft.Data.Sqlite;using LEGAL.AnalisiRischio.Api.Models;
namespace LEGAL.AnalisiRischio.Api.Repositories;
public class AnalisiRischioRepository{private readonly string _cs;public AnalisiRischioRepository(string cs)=>_cs=cs;private SqliteConnection C()=>new(_cs);
public async Task InitializeAsync(){using var c=C();await c.OpenAsync();await c.ExecuteAsync(@"
CREATE TABLE IF NOT EXISTS analisi_rischio(Id TEXT PRIMARY KEY,ContrattoId TEXT NOT NULL,ScoreRischio REAL NOT NULL DEFAULT 0,Livello TEXT NOT NULL DEFAULT 'Basso',ClausoleRischiose TEXT,Raccomandazioni TEXT,AnalizzatoDa TEXT,DataAnalisi TEXT NOT NULL,CreatedAt TEXT NOT NULL,UpdatedAt TEXT NOT NULL,Status INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS IX_analisi_rischio_ContrattoId ON analisi_rischio(ContrattoId);
CREATE TABLE IF NOT EXISTS checklist_compliance(Id TEXT PRIMARY KEY,Nome TEXT NOT NULL,Categoria TEXT NOT NULL DEFAULT 'Contrattuale',Items TEXT,CreatedAt TEXT NOT NULL,UpdatedAt TEXT NOT NULL,Status INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS verifiche_compliance(Id TEXT PRIMARY KEY,ChecklistId TEXT NOT NULL,ContrattoId TEXT NOT NULL,Risultato TEXT,Completamento REAL NOT NULL DEFAULT 0,VerificatoDa TEXT,DataVerifica TEXT NOT NULL,CreatedAt TEXT NOT NULL,UpdatedAt TEXT NOT NULL,Status INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS IX_verifiche_compliance_ContrattoId ON verifiche_compliance(ContrattoId);");}

public async Task<Models.AnalisiRischio> CreateAnalisiAsync(Models.AnalisiRischio e){using var c=C();await c.ExecuteAsync("INSERT INTO analisi_rischio(Id,ContrattoId,ScoreRischio,Livello,ClausoleRischiose,Raccomandazioni,AnalizzatoDa,DataAnalisi,CreatedAt,UpdatedAt,Status)VALUES(@Id,@ContrattoId,@ScoreRischio,@Livello,@ClausoleRischiose,@Raccomandazioni,@AnalizzatoDa,@DataAnalisi,@CreatedAt,@UpdatedAt,@Status)",e);return e;}
public async Task<List<Models.AnalisiRischio>> GetByContrattoAsync(Guid cid){using var c=C();return(await c.QueryAsync<Models.AnalisiRischio>("SELECT * FROM analisi_rischio WHERE ContrattoId=@C AND Status=0 ORDER BY DataAnalisi DESC",new{C=cid.ToString()})).ToList();}
public async Task<Models.AnalisiRischio?> GetByIdAsync(Guid id){using var c=C();return await c.QueryFirstOrDefaultAsync<Models.AnalisiRischio>("SELECT * FROM analisi_rischio WHERE Id=@Id AND Status=0",new{Id=id.ToString()});}
public async Task<object> GetDashboardAsync(){using var c=C();var t=await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM analisi_rischio WHERE Status=0");var basso=await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM analisi_rischio WHERE Livello='Basso' AND Status=0");var medio=await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM analisi_rischio WHERE Livello='Medio' AND Status=0");var alto=await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM analisi_rischio WHERE Livello='Alto' AND Status=0");var critico=await c.ExecuteScalarAsync<int>("SELECT COUNT(*) FROM analisi_rischio WHERE Livello='Critico' AND Status=0");var avg=await c.ExecuteScalarAsync<double?>("SELECT AVG(ScoreRischio) FROM analisi_rischio WHERE Status=0")??0;return new{Totale=t,Basso=basso,Medio=medio,Alto=alto,Critico=critico,ScoreMedio=Math.Round(avg,1)};}
public async Task<List<Models.AnalisiRischio>> GetTrendAsync(int limit=50){using var c=C();return(await c.QueryAsync<Models.AnalisiRischio>("SELECT * FROM analisi_rischio WHERE Status=0 ORDER BY DataAnalisi DESC LIMIT @L",new{L=limit})).ToList();}

// Checklist
public async Task<List<ChecklistCompliance>> GetChecklistsAsync(){using var c=C();return(await c.QueryAsync<ChecklistCompliance>("SELECT * FROM checklist_compliance WHERE Status=0 ORDER BY Nome")).ToList();}
public async Task<ChecklistCompliance?> GetChecklistByIdAsync(Guid id){using var c=C();return await c.QueryFirstOrDefaultAsync<ChecklistCompliance>("SELECT * FROM checklist_compliance WHERE Id=@Id AND Status=0",new{Id=id.ToString()});}
public async Task<ChecklistCompliance> CreateChecklistAsync(ChecklistCompliance e){using var c=C();await c.ExecuteAsync("INSERT INTO checklist_compliance(Id,Nome,Categoria,Items,CreatedAt,UpdatedAt,Status)VALUES(@Id,@Nome,@Categoria,@Items,@CreatedAt,@UpdatedAt,@Status)",e);return e;}
public async Task<bool> UpdateChecklistAsync(ChecklistCompliance e){using var c=C();return await c.ExecuteAsync("UPDATE checklist_compliance SET Nome=@Nome,Categoria=@Categoria,Items=@Items,UpdatedAt=@UpdatedAt WHERE Id=@Id AND Status=0",e)>0;}
public async Task<bool> DeleteChecklistAsync(Guid id){using var c=C();return await c.ExecuteAsync("UPDATE checklist_compliance SET Status=1,UpdatedAt=@N WHERE Id=@Id",new{Id=id.ToString(),N=DateTime.UtcNow})>0;}

// Verifiche
public async Task<VerificaCompliance> CreateVerificaAsync(VerificaCompliance e){using var c=C();await c.ExecuteAsync("INSERT INTO verifiche_compliance(Id,ChecklistId,ContrattoId,Risultato,Completamento,VerificatoDa,DataVerifica,CreatedAt,UpdatedAt,Status)VALUES(@Id,@ChecklistId,@ContrattoId,@Risultato,@Completamento,@VerificatoDa,@DataVerifica,@CreatedAt,@UpdatedAt,@Status)",e);return e;}
public async Task<List<VerificaCompliance>> GetVerificheByContrattoAsync(Guid cid){using var c=C();return(await c.QueryAsync<VerificaCompliance>("SELECT * FROM verifiche_compliance WHERE ContrattoId=@C AND Status=0 ORDER BY DataVerifica DESC",new{C=cid.ToString()})).ToList();}
}
