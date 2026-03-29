using Microsoft.AspNetCore.Mvc;using LEGAL.AnalisiContratti.Api.Models;using LEGAL.AnalisiContratti.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.AnalisiContratti.Api.Controllers;
[ApiController][Route("api")]public class AnalisiContrattiController:ControllerBase{
private readonly IAnalisiContrattiService _s;public AnalisiContrattiController(IAnalisiContrattiService s)=>_s=s;

[HttpPost("analisi/contratto/{id}")]public async Task<ActionResult> AnalizzaContratto(Guid id,[FromBody]AnalizzaContrattoRequest r){r.ContrattoId=id;return Ok(ApiResponse<AnalisiContratto>.Ok(await _s.AnalizzaContrattoAsync(r),"Analisi completata"));}
[HttpGet("analisi/contratto/{id}")]public async Task<ActionResult> GetByContratto(Guid id)=>Ok(ApiResponse<List<AnalisiContratto>>.Ok(await _s.GetByContrattoAsync(id)));
[HttpGet("analisi/recenti")]public async Task<ActionResult> GetRecenti()=>Ok(ApiResponse<List<AnalisiContratto>>.Ok(await _s.GetRecentiAsync()));
[HttpGet("analisi/{id}/clausole")]public async Task<ActionResult> GetClausole(Guid id)=>Ok(ApiResponse<List<ClausolaRilevata>>.Ok(await _s.GetClausoleAsync(id)));
[HttpGet("analisi/statistiche-rischio")]public async Task<ActionResult> GetStatisticheRischio()=>Ok(ApiResponse<object>.Ok(await _s.GetStatisticheRischioAsync()));
[HttpGet("analisi/contratti-rischiosi")]public async Task<ActionResult> GetContrattiRischiosi()=>Ok(ApiResponse<List<AnalisiContratto>>.Ok(await _s.GetContrattiRischiosiAsync()));
}
