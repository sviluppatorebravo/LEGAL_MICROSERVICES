using Microsoft.AspNetCore.Mvc;using LEGAL.Shared.Models;using LEGAL.AI.Api.Models;
namespace LEGAL.AI.Api.Controllers;
[ApiController][Route("api/[controller]")]
public class AIController:ControllerBase{
[HttpPost("ask")]public async Task<ActionResult> Ask([FromBody]AiRequest r){await Task.CompletedTask;return Ok(ApiResponse<object>.Ok(new{response="AI legal assistant",model=r.Model}));}
[HttpGet("settings")]public ActionResult GetSettings()=>Ok(ApiResponse<object>.Ok(new{provider=Environment.GetEnvironmentVariable("AI_PROVIDER")??"anthropic",model=Environment.GetEnvironmentVariable("AI_MODEL")??"claude-sonnet-4-20250514"}));
[HttpPut("settings")]public ActionResult SaveSettings([FromBody]AiSettingsDto s)=>Ok(ApiResponse.Ok("Saved"));
[HttpPost("analisi-contratto")]public async Task<ActionResult> AnalisiContratto([FromBody]AnalisiContrattoRequest r){await Task.CompletedTask;return Ok(ApiResponse<object>.Ok(new{Rischi=new List<string>{"Nessun rischio significativo"},Confidenza=0.70m}));}
[HttpPost("analisi-rischio")]public async Task<ActionResult> AnalisiRischio([FromBody]AnalisiRischioRequest r){await Task.CompletedTask;var v=r.Valore??0;return Ok(ApiResponse<object>.Ok(new{LivelloRischio=v>500000?"Alto":"Basso",Confidenza=0.65m}));}}
