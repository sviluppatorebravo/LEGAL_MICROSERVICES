using Microsoft.AspNetCore.Mvc;using LEGAL.Compliance.Api.Models;using LEGAL.Compliance.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.Compliance.Api.Controllers;
[ApiController][Route("api/[controller]")]public class ComplianceController:ControllerBase{
private readonly IComplianceService _s;public ComplianceController(IComplianceService s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null,[FromQuery]int? stato=null)=>Ok(ApiResponse<PagedResult<Adempimento>>.Ok(await _s.GetAllAsync(page,pageSize,search,tipo,stato)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Adempimento>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateAdempimentoRequest r){var i=await _s.CreateAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<Adempimento>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateAdempimentoRequest r){var i=await _s.UpdateAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Adempimento>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));
[HttpGet("dashboard")]public async Task<ActionResult> Dashboard()=>Ok(ApiResponse<object>.Ok(await _s.GetDashboardAsync()));
[HttpGet("normativa/{normativa}")]public async Task<ActionResult> PerNormativa(string normativa)=>Ok(ApiResponse<List<Adempimento>>.Ok(await _s.GetPerNormativaAsync(normativa)));
[HttpGet("{aid}/audit")]public async Task<ActionResult> GetAudit(Guid aid)=>Ok(ApiResponse<List<AuditCompliance>>.Ok(await _s.GetAuditAsync(aid)));
[HttpPost("{aid}/audit")]public async Task<ActionResult> CreateAudit(Guid aid,[FromBody]CreateAuditRequest r){r.AdempimentoId=aid;return Ok(ApiResponse<AuditCompliance>.Ok(await _s.CreateAuditAsync(r)));}}
