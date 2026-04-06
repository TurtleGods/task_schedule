using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Notifications;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMyNotifications([FromServices] ApplicationDbContext dbContext)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var notifications = (await dbContext.Notifications
            .Where(x => x.UserId == parsedUserId)
            .ToListAsync())
            .OrderByDescending(x => x.CreatedAt)
            .ToList();

        return Ok(notifications);
    }

    [HttpPut("{notificationId:guid}/read")]
    public async Task<IActionResult> MarkAsRead(Guid notificationId, [FromServices] ApplicationDbContext dbContext)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userId, out var parsedUserId))
        {
            return Unauthorized();
        }

        var notification = await dbContext.Notifications.FirstOrDefaultAsync(x => x.Id == notificationId && x.UserId == parsedUserId);
        if (notification is null)
        {
            return NotFound(new { error = "Notification not found." });
        }

        notification.IsRead = true;
        await dbContext.SaveChangesAsync();

        return Ok(notification);
    }
}
