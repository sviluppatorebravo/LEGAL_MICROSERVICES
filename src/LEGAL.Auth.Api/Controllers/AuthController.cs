using Microsoft.AspNetCore.Mvc;using LEGAL.Shared.Models;
namespace LEGAL.Auth.Api.Controllers;
[ApiController][Route("api/[controller]")]
public class AuthController:ControllerBase{
[HttpPost("validate")]public ActionResult Validate([FromHeader(Name="Authorization")]string? token){if(string.IsNullOrEmpty(token))return Unauthorized(ApiResponse.Fail("Token mancante"));return Ok(ApiResponse<object>.Ok(new{Valid=true,UserId=Guid.NewGuid().ToString(),Email="utente@azienda.it",Ruolo="admin"}));}
[HttpGet("me")]public ActionResult GetMe()=>Ok(ApiResponse<object>.Ok(new{Id=Guid.NewGuid().ToString(),Email="utente@azienda.it",Nome="Utente Demo",Ruolo="admin"}));}
