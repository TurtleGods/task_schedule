namespace TaskSchedule.Api.Contracts.Notifications;

public record NotificationDto(
    Guid Id,
    Guid UserId,
    string Type,
    string Message,
    bool IsRead,
    DateTimeOffset CreatedAt);
