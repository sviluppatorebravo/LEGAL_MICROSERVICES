namespace LEGAL.AI.Api.Models;
public class AiRequest{public string? Prompt{get;set;}public string? Context{get;set;}public string? Model{get;set;}}
public class AiSettingsDto{public string? Provider{get;set;}public string? Model{get;set;}public string? ApiKey{get;set;}}
public class AnalisiContrattoRequest{public string? Titolo{get;set;}public string? Descrizione{get;set;}public string? Clausole{get;set;}}
public class AnalisiRischioRequest{public string? Titolo{get;set;}public string? Descrizione{get;set;}public string? Tipo{get;set;}public decimal? Valore{get;set;}}
