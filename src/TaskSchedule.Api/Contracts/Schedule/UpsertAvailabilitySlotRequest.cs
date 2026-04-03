namespace TaskSchedule.Api.Contracts.Schedule;

public record UpsertAvailabilitySlotRequest(
    DateTimeOffset StartAt,
    DateTimeOffset EndAt,
    string TimeZone);
