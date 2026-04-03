namespace TaskSchedule.Api.Contracts.Profiles;

public record UpsertProviderProfileRequest(
    string DisplayName,
    string? Headline,
    string? Bio,
    string? ServiceArea,
    string? PricingNotes,
    bool IsPublished);
