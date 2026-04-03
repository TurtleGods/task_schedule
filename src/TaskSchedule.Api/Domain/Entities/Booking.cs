namespace TaskSchedule.Api.Domain.Entities;

public class Booking
{
    public Guid Id { get; set; }
    public Guid ProviderProfileId { get; set; }
    public Guid ClientProfileId { get; set; }
    public Guid AvailabilitySlotId { get; set; }
    public string Status { get; set; } = "pending";
    public string? Notes { get; set; }
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
