using Microsoft.AspNetCore.Mvc;using LEGAL.Modello231.Api.Models;using LEGAL.Modello231.Api.Services;using LEGAL.Shared.Models;
namespace LEGAL.Modello231.Api.Controllers;
[ApiController][Route("api/modello-231")]public class Modello231Controller:ControllerBase{
private readonly IModello231Service _s;public Modello231Controller(IModello231Service s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? stato=null)=>Ok(ApiResponse<PagedResult<ModelloOrganizzativo>>.Ok(await _s.GetModelliAsync(page,pageSize,search,stato)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetModelloByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<ModelloOrganizzativo>.Ok(i));}
[HttpGet("vigente")]public async Task<ActionResult> GetVigente(){var i=await _s.GetModelloVigenteAsync();return i==null?NotFound(ApiResponse.Fail("Nessun modello vigente")):Ok(ApiResponse<ModelloOrganizzativo>.Ok(i));}
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateModelloRequest r){var i=await _s.CreateModelloAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<ModelloOrganizzativo>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateModelloRequest r){var i=await _s.UpdateModelloAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<ModelloOrganizzativo>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteModelloAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));
[HttpGet("dashboard")]public async Task<ActionResult> Dashboard()=>Ok(ApiResponse<object>.Ok(await _s.GetDashboardAsync()));}

[ApiController][Route("api/aree-rischio-231")]public class AreeRischio231Controller:ControllerBase{
private readonly IModello231Service _s;public AreeRischio231Controller(IModello231Service s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null)=>Ok(ApiResponse<PagedResult<AreaRischio231>>.Ok(await _s.GetAreeRischioAsync(page,pageSize,search,tipo)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetAreaRischioByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<AreaRischio231>.Ok(i));}
[HttpGet("matrice")]public async Task<ActionResult> Matrice()=>Ok(ApiResponse<List<AreaRischio231>>.Ok(await _s.GetAreeRischioMatriceAsync()));
[HttpGet("critiche")]public async Task<ActionResult> Critiche()=>Ok(ApiResponse<List<AreaRischio231>>.Ok(await _s.GetAreeRischioCriticheAsync()));
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateAreaRischioRequest r){var i=await _s.CreateAreaRischioAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<AreaRischio231>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateAreaRischioRequest r){var i=await _s.UpdateAreaRischioAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<AreaRischio231>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteAreaRischioAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));}

[ApiController][Route("api/protocolli-231")]public class Protocolli231Controller:ControllerBase{
private readonly IModello231Service _s;public Protocolli231Controller(IModello231Service s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null)=>Ok(ApiResponse<PagedResult<Protocollo231>>.Ok(await _s.GetProtocolliAsync(page,pageSize,search,tipo)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetProtocolloByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Protocollo231>.Ok(i));}
[HttpGet("scaduti")]public async Task<ActionResult> Scaduti()=>Ok(ApiResponse<List<Protocollo231>>.Ok(await _s.GetProtocolliScadutiAsync()));
[HttpGet("area/{areaId}")]public async Task<ActionResult> ByArea(Guid areaId)=>Ok(ApiResponse<List<Protocollo231>>.Ok(await _s.GetProtocolliByAreaAsync(areaId)));
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateProtocolloRequest r){var i=await _s.CreateProtocolloAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<Protocollo231>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateProtocolloRequest r){var i=await _s.UpdateProtocolloAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<Protocollo231>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteProtocolloAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));}

[ApiController][Route("api/flussi-odv")]public class FlussiODVController:ControllerBase{
private readonly IModello231Service _s;public FlussiODVController(IModello231Service s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20,[FromQuery]string? search=null,[FromQuery]int? tipo=null)=>Ok(ApiResponse<PagedResult<FlussoInformativoODV>>.Ok(await _s.GetFlussiAsync(page,pageSize,search,tipo)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetFlussoByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<FlussoInformativoODV>.Ok(i));}
[HttpGet("in-esame")]public async Task<ActionResult> InEsame()=>Ok(ApiResponse<List<FlussoInformativoODV>>.Ok(await _s.GetFlussiInEsameAsync()));
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateFlussoODVRequest r){var i=await _s.CreateFlussoAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<FlussoInformativoODV>.Ok(i));}
[HttpPut("{id}")]public async Task<ActionResult> Update(Guid id,[FromBody]UpdateFlussoODVRequest r){var i=await _s.UpdateFlussoAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<FlussoInformativoODV>.Ok(i));}
[HttpPost("{id}/esamina")]public async Task<ActionResult> Esamina(Guid id,[FromBody]EsaminaFlussoRequest r){var i=await _s.EsaminaFlussoAsync(id,r);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<FlussoInformativoODV>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteFlussoAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));}

[ApiController][Route("api/verifiche-odv")]public class VerificheODVController:ControllerBase{
private readonly IModello231Service _s;public VerificheODVController(IModello231Service s)=>_s=s;
[HttpGet]public async Task<ActionResult> GetAll([FromQuery]int page=1,[FromQuery]int pageSize=20)=>Ok(ApiResponse<PagedResult<VerificaODV>>.Ok(await _s.GetVerificheAsync(page,pageSize)));
[HttpGet("{id}")]public async Task<ActionResult> GetById(Guid id){var i=await _s.GetVerificaByIdAsync(id);return i==null?NotFound(ApiResponse.Fail("Non trovato")):Ok(ApiResponse<VerificaODV>.Ok(i));}
[HttpGet("prossime")]public async Task<ActionResult> Prossime()=>Ok(ApiResponse<List<VerificaODV>>.Ok(await _s.GetVerificheProssimeAsync()));
[HttpGet("non-conformi")]public async Task<ActionResult> NonConformi()=>Ok(ApiResponse<List<VerificaODV>>.Ok(await _s.GetVerificheNonConformiAsync()));
[HttpPost]public async Task<ActionResult> Create([FromBody]CreateVerificaODVRequest r){var i=await _s.CreateVerificaAsync(r);return CreatedAtAction(nameof(GetById),new{id=i.Id},ApiResponse<VerificaODV>.Ok(i));}
[HttpDelete("{id}")]public async Task<ActionResult> Delete(Guid id)=>await _s.DeleteVerificaAsync(id)?Ok(ApiResponse.Ok("Eliminato")):NotFound(ApiResponse.Fail("Non trovato"));}
