using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TaskSchedule.Api.Contracts.Portfolio;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Auth;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Portfolio;

[ApiController]
[Route("api/portfolio")]
[Authorize(Policy = AuthorizationPolicies.ProviderOnly)]
public class PortfolioController : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> GetMyPortfolio([FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var items = await dbContext.PortfolioItems
            .Where(x => x.ProviderProfileId == providerProfile.Id)
            .OrderBy(x => x.SortOrder)
            .ThenBy(x => x.Title)
            .ToListAsync();

        return Ok(items);
    }

    [HttpPost("me")]
    public async Task<IActionResult> CreatePortfolioItem(
        [FromBody] UpsertPortfolioItemRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var item = new PortfolioItem
        {
            Id = Guid.NewGuid(),
            ProviderProfileId = providerProfile.Id,
            Title = request.Title,
            Description = request.Description,
            ImageUrl = request.ImageUrl,
            ExternalUrl = request.ExternalUrl,
            SortOrder = request.SortOrder,
        };

        dbContext.PortfolioItems.Add(item);
        await dbContext.SaveChangesAsync();

        return Ok(item);
    }

    [HttpPut("me/{itemId:guid}")]
    public async Task<IActionResult> UpdatePortfolioItem(
        Guid itemId,
        [FromBody] UpsertPortfolioItemRequest request,
        [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var item = await dbContext.PortfolioItems.FirstOrDefaultAsync(x => x.Id == itemId && x.ProviderProfileId == providerProfile.Id);
        if (item is null)
        {
            return NotFound(new { error = "Portfolio item not found." });
        }

        item.Title = request.Title;
        item.Description = request.Description;
        item.ImageUrl = request.ImageUrl;
        item.ExternalUrl = request.ExternalUrl;
        item.SortOrder = request.SortOrder;

        await dbContext.SaveChangesAsync();
        return Ok(item);
    }

    [HttpDelete("me/{itemId:guid}")]
    public async Task<IActionResult> DeletePortfolioItem(Guid itemId, [FromServices] ApplicationDbContext dbContext)
    {
        var providerProfile = await GetProviderProfileAsync(dbContext);
        if (providerProfile is null)
        {
            return NotFound(new { error = "Provider profile not found." });
        }

        var item = await dbContext.PortfolioItems.FirstOrDefaultAsync(x => x.Id == itemId && x.ProviderProfileId == providerProfile.Id);
        if (item is null)
        {
            return NotFound(new { error = "Portfolio item not found." });
        }

        dbContext.PortfolioItems.Remove(item);
        await dbContext.SaveChangesAsync();
        return NoContent();
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
