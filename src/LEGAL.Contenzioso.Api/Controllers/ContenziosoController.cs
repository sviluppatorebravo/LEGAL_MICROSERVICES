using Microsoft.AspNetCore.Mvc;using LEGAL.Contenzioso.Api.Models;using LEGAL.Contenzioso.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.Contenzioso.Api.Controllers;
[ApiController][Route("api/[controller]")]public class ContenziosoController:ControllerBase{
private readonly IContenziosoService _s;public ContenziosoController(IContenziosoService s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null,[FromQuery]int? stato=null)=>Ok(ApiResponse<PagedResult<CasoContenzioso>>.Ok(await _s.GetAllAsync(page,pageSize,search,tipo,stato)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<CasoContenzioso>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateContenziosoRequest r){var i=await _s.CreateAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<CasoContenzioso>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateContenziosoRequest r){var i=await _s.UpdateAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<CasoContenzioso>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));
[HttpGet("statistiche")]public async Task<ActionResult> Stats()=>Ok(ApiResponse<object>.Ok(await _s.GetStatisticheAsync()));
[HttpGet("{cid}/atti")]public async Task<ActionResult> GetAtti(Guid cid)=>Ok(ApiResponse<List<AttoProcessuale>>.Ok(await _s.GetAttiAsync(cid)));
[HttpPost("{cid}/atti")]public async Task<ActionResult> CreateAtto(Guid cid,[FromBody]CreateAttoRequest r){r.ContenziosoId=cid;return Ok(ApiResponse<AttoProcessuale>.Ok(await _s.CreateAttoAsync(r)));}}
