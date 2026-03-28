using Microsoft.AspNetCore.Mvc;using LEGAL.AnalisiRischio.Api.Models;using LEGAL.AnalisiRischio.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.AnalisiRischio.Api.Controllers;
[ApiController][Route("api")]public class AnalisiRischioController:ControllerBase{
private readonly IAnalisiRischioService _s;public AnalisiRischioController(IAnalisiRischioService s)=>_s=s;

[HttpPost("analisi-rischio/analizza")]public async Task<ActionResult> Analizza([FromBody]AnalizzaContrattoRequest r)=>Ok(ApiResponse<Models.AnalisiRischio>.Ok(await _s.AnalizzaContrattoAsync(r),"Analisi completata"));
[HttpGet("analisi-rischio/contratto/{id}")]public async Task<ActionResult> GetByContratto(Guid id)=>Ok(ApiResponse<List<Models.AnalisiRischio>>.Ok(await _s.GetByContrattoAsync(id)));
[HttpGet("analisi-rischio/dashboard")]public async Task<ActionResult> Dashboard()=>Ok(ApiResponse<object>.Ok(await _s.GetDashboardAsync()));
[HttpGet("analisi-rischio/trend")]public async Task<ActionResult> Trend()=>Ok(ApiResponse<List<Models.AnalisiRischio>>.Ok(await _s.GetTrendAsync()));

// CRUD Checklist
[HttpGet("checklist-compliance")]public async Task<ActionResult> GetChecklists()=>Ok(ApiResponse<List<ChecklistCompliance>>.Ok(await _s.GetChecklistsAsync()));
[HttpGet("checklist-compliance/{id}")]public async Task<ActionResult> GetChecklist(Guid id){var i=await _s.GetChecklistByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<ChecklistCompliance>.Ok(i));}
[HttpPost("checklist-compliance")]public async Task<ActionResult> CreateChecklist([FromBody]CreateChecklistRequest r){var i=await _s.CreateChecklistAsync(r);return CreatedAtAction(nameof(GetChecklist),new{id=i.Id},ApiResponse<ChecklistCompliance>.Ok(i));}
[HttpPut("checklist-compliance/{id}")]public async Task<ActionResult> UpdateChecklist(Guid id,[FromBody]UpdateChecklistRequest r){var i=await _s.UpdateChecklistAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovata")):Ok(ApiResponse<ChecklistCompliance>.Ok(i));}
[HttpDelete("checklist-compliance/{id}")]public async Task<ActionResult> DeleteChecklist(Guid id)=>await _s.DeleteChecklistAsync(id)?Ok(ApiResponse.Ok("Eliminata")):NotFound(ApiResponse.Fail("Non trovata"));

// Verifiche
[HttpPost("verifiche-compliance")]public async Task<ActionResult> CreateVerifica([FromBody]CreateVerificaRequest r)=>Ok(ApiResponse<VerificaCompliance>.Ok(await _s.CreateVerificaAsync(r)));
[HttpGet("verifiche-compliance/contratto/{id}")]public async Task<ActionResult> GetVerifiche(Guid id)=>Ok(ApiResponse<List<VerificaCompliance>>.Ok(await _s.GetVerificheByContrattoAsync(id)));}
