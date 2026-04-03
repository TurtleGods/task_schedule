namespace TaskSchedule.Api.Domain.Entities;

public class ProviderProfile
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? Headline { get; set; }
    public string? Bio { get; set; }
    public string? ServiceArea { get; set; }
    public string? PricingNotes { get; set; }
    public bool IsPublished { get; set; }
}
