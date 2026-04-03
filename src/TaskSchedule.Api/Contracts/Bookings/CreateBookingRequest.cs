namespace TaskSchedule.Api.Contracts.Bookings;

public record CreateBookingRequest(
    Guid AvailabilitySlotId,
    string? Notes);
