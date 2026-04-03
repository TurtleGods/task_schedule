namespace TaskSchedule.Api.Contracts.Identity;

public record RegisterRequest(
    string Email,
    string Password,
    string DisplayName,
    string Role,
    string? TimeZone);
