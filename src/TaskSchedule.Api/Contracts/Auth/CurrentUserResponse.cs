namespace TaskSchedule.Api.Contracts.Auth;

public record CurrentUserResponse(string? UserId, string? Email, string? DisplayName, bool IsAuthenticated, IEnumerable<string> Roles);
