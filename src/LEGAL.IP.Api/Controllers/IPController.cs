using Microsoft.AspNetCore.Mvc;using LEGAL.IP.Api.Models;using LEGAL.IP.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.IP.Api.Controllers;
[ApiController][Route("api/[controller]")]public class ProprietaIntellettualeController:ControllerBase{
private readonly IIPService _s;public ProprietaIntellettualeController(IIPService s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null)=>Ok(ApiResponse<PagedResult<ProprietaIntellettuale>>.Ok(await _s.GetAllAsync(page,pageSize,search,tipo)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<ProprietaIntellettuale>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateIPRequest r){var i=await _s.CreateAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<ProprietaIntellettuale>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateIPRequest r){var i=await _s.UpdateAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<ProprietaIntellettuale>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAsync(id)?Ok(ApiResponse.Ok("Eliminata")):NotFound(ApiResponse.Fail("Non trovata"));
[HttpGet("in-scadenza")]public async Task<ActionResult> InScadenza([FromQuery]int giorni=90)=>Ok(ApiResponse<List<ProprietaIntellettuale>>.Ok(await _s.GetInScadenzaAsync(giorni)));
[HttpGet("statistiche")]public async Task<ActionResult> Stats()=>Ok(ApiResponse<object>.Ok(await _s.GetStatisticheAsync()));
[HttpGet("{ipId}/licenze")]public async Task<ActionResult> GetLicenze(Guid ipId)=>Ok(ApiResponse<List<LicenzaIP>>.Ok(await _s.GetLicenzeAsync(ipId)));
[HttpPost("{ipId}/licenze")]public async Task<ActionResult> CreateLicenza(Guid ipId,[FromBody]CreateLicenzaIPRequest r){r.IPId=ipId;return Ok(ApiResponse<LicenzaIP>.Ok(await _s.CreateLicenzaAsync(r)));}}
