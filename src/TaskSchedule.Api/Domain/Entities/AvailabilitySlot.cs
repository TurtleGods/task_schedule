namespace TaskSchedule.Api.Domain.Entities;

public class AvailabilitySlot
{
    public Guid Id { get; set; }
    public Guid ProviderProfileId { get; set; }
    public DateTimeOffset StartAt { get; set; }
    public DateTimeOffset EndAt { get; set; }
    public string TimeZone { get; set; } = "Asia/Taipei";
    public bool IsBooked { get; set; }
}
