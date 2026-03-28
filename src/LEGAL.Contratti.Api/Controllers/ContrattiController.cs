using Microsoft.AspNetCore.Mvc;using LEGAL.Contratti.Api.Models;using LEGAL.Contratti.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.Contratti.Api.Controllers;
[ApiController][Route("api/[controller]")]public class ContrattiController:ControllerBase{
private readonly IContrattiService _s;public ContrattiController(IContrattiService s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null,[FromQuery]int? stato=null)=>Ok(ApiResponse<PagedResult<Contratto>>.Ok(await _s.GetAllAsync(page,pageSize,search,tipo,stato)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Contratto>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateContrattoRequest r){var i=await _s.CreateAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<Contratto>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateContrattoRequest r){var i=await _s.UpdateAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Contratto>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));
[HttpGet("rinnovi-in-scadenza")]public async Task<ActionResult> Rinnovi([FromQuery]int giorni=30)=>Ok(ApiResponse<List<Contratto>>.Ok(await _s.GetRinnoviInScadenzaAsync(giorni)));
[HttpGet("statistiche")]public async Task<ActionResult> Stats()=>Ok(ApiResponse<object>.Ok(await _s.GetStatisticheAsync()));
[HttpGet("{cid}/clausole")]public async Task<ActionResult> GetClausole(Guid cid)=>Ok(ApiResponse<List<Clausola>>.Ok(await _s.GetClausoleAsync(cid)));
[HttpPost("{cid}/clausole")]public async Task<ActionResult> CreateClausola(Guid cid,[FromBody]CreateClausolaRequest r){r.ContrattoId=cid;return Ok(ApiResponse<Clausola>.Ok(await _s.CreateClausolaAsync(r)));}
[HttpDelete("clausole/{id}")]public async Task<ActionResult> DeleteClausola(Guid id)=>await _s.DeleteClausolaAsync(id)?Ok(ApiResponse.Ok("Eliminata")):NotFound(ApiResponse.Fail("Non trovata"));
[HttpGet("{cid}/versioni")]public async Task<ActionResult> GetVersioni(Guid cid)=>Ok(ApiResponse<List<VersioneContratto>>.Ok(await _s.GetVersioniAsync(cid)));
[HttpPost("{cid}/versioni")]public async Task<ActionResult> CreateVersione(Guid cid,[FromBody]CreateVersioneRequest r){r.ContrattoId=cid;return Ok(ApiResponse<VersioneContratto>.Ok(await _s.CreateVersioneAsync(r)));}}
