namespace TaskSchedule.Api.Domain.Entities;

public class PortfolioItem
{
    public Guid Id { get; set; }
    public Guid ProviderProfileId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? ExternalUrl { get; set; }
    public int SortOrder { get; set; }
}
