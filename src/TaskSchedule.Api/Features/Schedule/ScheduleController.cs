using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskSchedule.Api.Contracts.Schedule;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Auth;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Schedule;

[ApiController]
[Route("api/schedule")]
[Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
public class ScheduleController : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMySlots([FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var slots = await dbContext.AvailabilitySlots
            .Where(x => x.ProviderProfileId == providerProfile.Id)
            .OrderBy(x => x.StartAt)
            .ToListAsync();

        return Ok(slots);
    }

    [HttpPost("me")]
    public async Task<IActionResult> CreateSlot(
        [FromBody] UpsertAvailabilitySlotRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var validationError = await ValidateSlotRequestAsync(dbContext, providerProfile.Id, request, null);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        var slot = new AvailabilitySlot
        {
            Id = Guid.NewGuid(),
            ProviderProfileId = providerProfile.Id,
            StartAt = request.StartAt,
            EndAt = request.EndAt,
            TimeZone = NormalizeTimeZone(request.TimeZone),
            IsBooked = false,
        };

        dbContext.AvailabilitySlots.Add(slot);
        await dbContext.SaveChangesAsync();

        return Ok(slot);
    }

    [HttpPut("me/{slotId:guid}")]
    public async Task<IActionResult> UpdateSlot(
        Guid slotId,
        [FromBody] UpsertAvailabilitySlotRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var slot = await dbContext.AvailabilitySlots.FirstOrDefaultAsync(x => x.Id == slotId && x.ProviderProfileId == providerProfile.Id);
        if (slot is null)
        {
            return NotFound(new { error = "Slot not found." });
        }

        if (slot.IsBooked)
        {
            return BadRequest(new { error = "Booked slot cannot be modified." });
        }

        var validationError = await ValidateSlotRequestAsync(dbContext, providerProfile.Id, request, slotId);
        if (validationError is not null)
        {
            return BadRequest(new { error = validationError });
        }

        slot.StartAt = request.StartAt;
        slot.EndAt = request.EndAt;
        slot.TimeZone = NormalizeTimeZone(request.TimeZone);

        await dbContext.SaveChangesAsync();
        return Ok(slot);
    }

    [HttpDelete("me/{slotId:guid}")]
    public async Task<IActionResult> DeleteSlot(Guid slotId, [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var slot = await dbContext.AvailabilitySlots.FirstOrDefaultAsync(x => x.Id == slotId && x.ProviderProfileId == providerProfile.Id);
        if (slot is null)
        {
            return NotFound(new { error = "Slot not found." });
        }

        if (slot.IsBooked)
        {
            return BadRequest(new { error = "Booked slot cannot be deleted." });
        }

        dbContext.AvailabilitySlots.Remove(slot);
        await dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("timezone-policy")]
    [AllowAnonymous]
    public IActionResult GetTimeZonePolicy()
    {
        return Ok(new
        {
            storage = "DateTimeOffset",
            defaultTimeZone = "Asia/Taipei",
            rule = "All availability slots are stored with offset-aware timestamps. Client UI should send and display the provider-selected time zone explicitly.",
        });
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

    private static string NormalizeTimeZone(string? timeZone)
    {
        return string.IsNullOrWhiteSpace(timeZone) ? "Asia/Taipei" : timeZone.Trim();
    }

    private static async Task<string?> ValidateSlotRequestAsync(
        ApplicationDbContext dbContext,
        Guid providerProfileId,
        UpsertAvailabilitySlotRequest request,
        Guid? currentSlotId)
    {
        if (request.EndAt <= request.StartAt)
        {
            return "EndAt must be later than StartAt.";
        }

        var hasConflict = await dbContext.AvailabilitySlots.AnyAsync(x =>
            x.ProviderProfileId == providerProfileId &&
            x.Id != currentSlotId &&
            request.StartAt < x.EndAt &&
            request.EndAt > x.StartAt);

        if (hasConflict)
        {
            return "Slot overlaps with an existing availability slot.";
        }

        return null;
    }
}
