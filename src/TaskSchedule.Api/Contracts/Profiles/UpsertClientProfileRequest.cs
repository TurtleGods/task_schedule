namespace TaskSchedule.Api.Contracts.Profiles;

public record UpsertClientProfileRequest(
    string DisplayName,
    string? CompanyName);
