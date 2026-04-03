using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using TaskSchedule.Api.Contracts.Profiles;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Auth;
using TaskSchedule.Api.Infrastructure.Identity;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Profiles;

[ApiController]
[Route("api/profiles")]
[Authorize]
public class ProfilesController : ControllerBase
{
    [HttpGet("provider/me")]
    [Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
    public async Task<IActionResult> GetMyProviderProfile(
        [FromServices] ApplicationDbContext dbContext)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var profile = await dbContext.ProviderProfiles.FirstOrDefaultAsync(x => x.UserId == userId.Value);
        if (profile is null) return NotFound(new { error = "Provider profile not found." });

        return Ok(profile);
    }

    [HttpPut("provider/me")]
    [Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
    public async Task<IActionResult> UpsertProviderProfile(
        [FromBody] UpsertProviderProfileRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var profile = await dbContext.ProviderProfiles.FirstOrDefaultAsync(x => x.UserId == userId.Value);
        if (profile is null)
        {
            profile = new ProviderProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
            };
            dbContext.ProviderProfiles.Add(profile);
        }

        profile.DisplayName = request.DisplayName;
        profile.Headline = request.Headline;
        profile.Bio = request.Bio;
        profile.ServiceArea = request.ServiceArea;
        profile.PricingNotes = request.PricingNotes;
        profile.IsPublished = request.IsPublished;

        await dbContext.SaveChangesAsync();
        return Ok(profile);
    }

    [HttpGet("client/me")]
    [Authorize(Policy = AuthorizationPolicies.ClientOnly)]
    public async Task<IActionResult> GetMyClientProfile(
        [FromServices] ApplicationDbContext dbContext)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var profile = await dbContext.ClientProfiles.FirstOrDefaultAsync(x => x.UserId == userId.Value);
        if (profile is null) return NotFound(new { error = "Client profile not found." });

        return Ok(profile);
    }

    [HttpPut("client/me")]
    [Authorize(Policy = AuthorizationPolicies.ClientOnly)]
    public async Task<IActionResult> UpsertClientProfile(
        [FromBody] UpsertClientProfileRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var profile = await dbContext.ClientProfiles.FirstOrDefaultAsync(x => x.UserId == userId.Value);
        if (profile is null)
        {
            profile = new ClientProfile
            {
                Id = Guid.NewGuid(),
                UserId = userId.Value,
            };
            dbContext.ClientProfiles.Add(profile);
        }

        profile.DisplayName = request.DisplayName;
        profile.CompanyName = request.CompanyName;

        await dbContext.SaveChangesAsync();
        return Ok(profile);
    }

    [HttpPost("bootstrap")]
    [AllowAnonymous]
    public async Task<IActionResult> BootstrapProfilesForExistingUsers(
        [FromServices] ApplicationDbContext dbContext,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var users = await userManager.Users.ToListAsync();
        var createdProviderProfiles = 0;
        var createdClientProfiles = 0;

        foreach (var user in users)
        {
            var roles = await userManager.GetRolesAsync(user);

            if (roles.Contains("Provider") && !await dbContext.ProviderProfiles.AnyAsync(x => x.UserId == user.Id))
            {
                dbContext.ProviderProfiles.Add(new ProviderProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    DisplayName = user.DisplayName ?? user.Email ?? "Provider",
                    IsPublished = false,
                });
                createdProviderProfiles++;
            }

            if (roles.Contains("Client") && !await dbContext.ClientProfiles.AnyAsync(x => x.UserId == user.Id))
            {
                dbContext.ClientProfiles.Add(new ClientProfile
                {
                    Id = Guid.NewGuid(),
                    UserId = user.Id,
                    DisplayName = user.DisplayName ?? user.Email ?? "Client",
                });
                createdClientProfiles++;
            }
        }

        await dbContext.SaveChangesAsync();

        return Ok(new
        {
            createdProviderProfiles,
            createdClientProfiles
        });
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsed) ? parsed : null;
    }
}
