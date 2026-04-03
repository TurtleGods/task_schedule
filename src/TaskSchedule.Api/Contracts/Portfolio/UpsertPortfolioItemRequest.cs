namespace TaskSchedule.Api.Contracts.Portfolio;

public record UpsertPortfolioItemRequest(
    string Title,
    string? Description,
    string? ImageUrl,
    string? ExternalUrl,
    int SortOrder);
