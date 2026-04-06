using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskSchedule.Api.Contracts.Bookings;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Auth;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Bookings;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private static readonly HashSet<string> AllowedStatuses = ["pending", "confirmed", "cancelled", "completed"];

    [HttpPost]
    [Authorize(Policy = AuthorizationPolicies.ClientOnly)]
    public async Task<IActionResult> CreateBooking(
        [FromBody] CreateBookingRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var clientProfile = await GetClientProfileAsync(dbContext);
        if (clientProfile is null)
        {
            return NotFound(new { error = "Client profile not found." });
        }

        var slot = await dbContext.AvailabilitySlots
            .FirstOrDefaultAsync(x => x.Id == request.AvailabilitySlotId);

        if (slot is null)
        {
            return NotFound(new { error = "Availability slot not found." });
        }

        if (slot.IsBooked)
        {
            return BadRequest(new { error = "Availability slot is already booked." });
        }

        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            ProviderProfileId = slot.ProviderProfileId,
            ClientProfileId = clientProfile.Id,
            AvailabilitySlotId = slot.Id,
            Status = "pending",
            Notes = request.Notes,
            CreatedAt = DateTimeOffset.UtcNow,
        };

        slot.IsBooked = true;
        dbContext.Bookings.Add(booking);

        dbContext.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = await dbContext.ProviderProfiles
                .Where(x => x.Id == slot.ProviderProfileId)
                .Select(x => x.UserId)
                .FirstAsync(),
            Type = "booking_created",
            Message = $"A new booking request was created for slot {slot.StartAt:yyyy-MM-dd HH:mm}.",
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow,
        });

        await dbContext.SaveChangesAsync();

        return Ok(booking);
    }

    [HttpGet("client/me")]
    [Authorize(Policy = AuthorizationPolicies.ClientOnly)]
    public async Task<IActionResult> GetMyClientBookings([FromServices] ApplicationDbContext dbContext)
    {
        var clientProfile = await GetClientProfileAsync(dbContext);
        if (clientProfile is null)
        {
            return NotFound(new { error = "Client profile not found." });
        }

        var bookings = (await dbContext.Bookings
            .Where(x => x.ClientProfileId == clientProfile.Id)
            .ToListAsync())
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(bookings);
    }

    [HttpGet("provider/me")]
    [Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
    public async Task<IActionResult> GetMyProviderBookings([FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var bookings = (await dbContext.Bookings
            .Where(x => x.ProviderProfileId == providerProfile.Id)
            .ToListAsync())
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(bookings);
    }

    [HttpPut("{bookingId:guid}/status")]
    [Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
    public async Task<IActionResult> UpdateBookingStatus(
        Guid bookingId,
        [FromBody] UpdateBookingStatusRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        if (!AllowedStatuses.Contains(request.Status))
        {
            return BadRequest(new { error = "Invalid booking status." });
        }

        var booking = await dbContext.Bookings
            .FirstOrDefaultAsync(x => x.Id == bookingId && x.ProviderProfileId == providerProfile.Id);

        if (booking is null)
        {
            return NotFound(new { error = "Booking not found." });
        }

        booking.Status = request.Status;

        if (request.Status == "cancelled")
        {
            var slot = await dbContext.AvailabilitySlots.FirstOrDefaultAsync(x => x.Id == booking.AvailabilitySlotId);
            if (slot is not null)
            {
                slot.IsBooked = false;
            }
        }

        var clientUserId = await dbContext.ClientProfiles
            .Where(x => x.Id == booking.ClientProfileId)
            .Select(x => x.UserId)
            .FirstAsync();

        dbContext.Notifications.Add(new Notification
        {
            Id = Guid.NewGuid(),
            UserId = clientUserId,
            Type = "booking_status_updated",
            Message = $"Your booking status has been updated to {request.Status}.",
            IsRead = false,
            CreatedAt = DateTimeOffset.UtcNow,
        });

        await dbContext.SaveChangesAsync();
        return Ok(booking);
    }

    private async Task<ClientProfile?> GetClientProfileAsync(ApplicationDbContext dbContext)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            return null;
        }

        return await dbContext.ClientProfiles.FirstOrDefaultAsync(x => x.UserId == parsedUserId);
    }

    private async Task<ProviderProfile?> GetProviderProfileAsync(ApplicationDbContext dbContext)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            return null;
        }

        return await dbContext.ProviderProfiles.FirstOrDefaultAsync(x => x.UserId == parsedUserId);
    }
}
