using Microsoft.AspNetCore.Mvc;using LEGAL.Scadenze.Api.Models;using LEGAL.Scadenze.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.Scadenze.Api.Controllers;
[ApiController][Route("api/[controller]")]public class ScadenzeController:ControllerBase{
private readonly IScadenzeService _s;public ScadenzeController(IScadenzeService s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null,[FromQuery]int? stato=null)=>Ok(ApiResponse<PagedResult<Scadenza>>.Ok(await _s.GetAllAsync(page,pageSize,search,tipo,stato)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<Scadenza>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateScadenzaRequest r){var i=await _s.CreateAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<Scadenza>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateScadenzaRequest r){var i=await _s.UpdateAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<Scadenza>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAsync(id)?Ok(ApiResponse.Ok("Eliminata")):NotFound(ApiResponse.Fail("Non trovata"));
[HttpGet("prossime")]public async Task<ActionResult> Prossime([FromQuery]int giorni=30)=>Ok(ApiResponse<List<Scadenza>>.Ok(await _s.GetProssimeAsync(giorni)));
[HttpGet("mese/{anno}/{mese}")]public async Task<ActionResult> PerMese(int anno,int mese)=>Ok(ApiResponse<List<Scadenza>>.Ok(await _s.GetPerMeseAsync(anno,mese)));
[HttpGet("responsabile/{rid}")]public async Task<ActionResult> PerResp(string rid)=>Ok(ApiResponse<List<Scadenza>>.Ok(await _s.GetPerResponsabileAsync(rid)));
[HttpGet("alert")]public async Task<ActionResult> Alert()=>Ok(ApiResponse<List<Scadenza>>.Ok(await _s.GetAlertAsync()));}
