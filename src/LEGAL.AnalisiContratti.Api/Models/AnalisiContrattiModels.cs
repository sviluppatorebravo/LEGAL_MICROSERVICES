using LEGAL.Shared.Models;
namespace LEGAL.AnalisiContratti.Api.Models;

public class AnalisiContratto : BaseEntity
{
    public Guid ContrattoId { get; set; }
    public string ContrattoTitolo { get; set; } = string.Empty;
    public DateTime DataAnalisi { get; set; } = DateTime.UtcNow;
    public string RischioGlobale { get; set; } = "Basso";
    public double PunteggioRischio { get; set; }
    public int ClausoleRischiose { get; set; }
    public int ClausoleMancanti { get; set; }
    public string? Raccomandazioni { get; set; }
    public string? AnalizzatoDa { get; set; }
}

public class ClausolaRilevata : BaseEntity
{
    public Guid AnalisiId { get; set; }
    public string Tipo { get; set; } = "Altro";
    public string Testo { get; set; } = string.Empty;
    public string Rischio { get; set; } = "Basso";
    public string? Note { get; set; }
    public int Pagina { get; set; }
}

public class AnalizzaContrattoRequest
{
    public Guid ContrattoId { get; set; }
    public string ContrattoTitolo { get; set; } = string.Empty;
    public string? Contenuto { get; set; }
    public string? AnalizzatoDa { get; set; }
}
