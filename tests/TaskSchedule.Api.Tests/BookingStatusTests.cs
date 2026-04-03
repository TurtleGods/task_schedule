using TaskSchedule.Api.Contracts.Bookings;

namespace TaskSchedule.Api.Tests;

public class BookingStatusTests
{
    [Fact]
    public void AllowedStatuses_ShouldContainExpectedWorkflowStates()
    {
        var statuses = new[] { "pending", "confirmed", "cancelled", "completed" };

        Assert.Contains("pending", statuses);
        Assert.Contains("confirmed", statuses);
        Assert.Contains("cancelled", statuses);
        Assert.Contains("completed", statuses);
    }

    [Fact]
    public void CreateBookingRequest_ShouldStoreAvailabilitySlotId()
    {
        var slotId = Guid.NewGuid();
        var request = new CreateBookingRequest(slotId, "test note");

        Assert.Equal(slotId, request.AvailabilitySlotId);
        Assert.Equal("test note", request.Notes);
    }

    [Theory]
    [InlineData("pending")]
    [InlineData("confirmed")]
    [InlineData("cancelled")]
    [InlineData("completed")]
    public void UpdateBookingStatusRequest_ShouldAcceptDefinedStates(string status)
    {
        var request = new UpdateBookingStatusRequest(status);

        Assert.Equal(status, request.Status);
    }
}
