using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskSchedule.Api.Infrastructure.Persistence;

namespace TaskSchedule.Api.Features.Marketplace;

[ApiController]
[Route("api/marketplace/providers")]
public class MarketplaceController : ControllerBase
{
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviders(
        [FromServices] ApplicationDbContext dbContext,
        [FromQuery] string? keyword,
        [FromQuery] string? serviceArea)
    {
        var query = dbContext.ProviderProfiles
            .Where(x => x.IsPublished)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            var normalizedKeyword = keyword.Trim();
            query = query.Where(x =>
                x.DisplayName.Contains(normalizedKeyword) ||
                (x.Headline != null && x.Headline.Contains(normalizedKeyword)) ||
                (x.Bio != null && x.Bio.Contains(normalizedKeyword)));
        }

        if (!string.IsNullOrWhiteSpace(serviceArea))
        {
            var normalizedServiceArea = serviceArea.Trim();
            query = query.Where(x => x.ServiceArea != null && x.ServiceArea.Contains(normalizedServiceArea));
        }

        var providers = await query
            .OrderBy(x => x.DisplayName)
            .Select(x => new
            {
                x.Id,
                x.DisplayName,
                x.Headline,
                x.Bio,
                x.ServiceArea,
                x.PricingNotes,
            })
            .ToListAsync();

        return Ok(providers);
    }

    [HttpGet("{providerId:guid}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetProviderDetail(Guid providerId, [FromServices] ApplicationDbContext dbContext)
    {
        var provider = await dbContext.ProviderProfiles
            .Where(x => x.Id == providerId && x.IsPublished)
            .Select(x => new
            {
                x.Id,
                x.DisplayName,
                x.Headline,
                x.Bio,
                x.ServiceArea,
                x.PricingNotes,
            })
            .FirstOrDefaultAsync();

        if (provider is null)
        {
            return NotFound(new { error = "Provider not found." });
        }

        var now = DateTimeOffset.UtcNow;

        var portfolioItems = await dbContext.PortfolioItems
            .Where(p => p.ProviderProfileId == providerId)
            .OrderBy(p => p.SortOrder)
            .Select(p => new
            {
                p.Id,
                p.Title,
                p.Description,
                p.ImageUrl,
                p.ExternalUrl,
                p.SortOrder
            })
            .ToListAsync();

        var availabilitySlots = await dbContext.AvailabilitySlots
            .Where(s => s.ProviderProfileId == providerId && !s.IsBooked && s.StartAt >= now)
            .OrderBy(s => s.StartAt)
            .Select(s => new
            {
                s.Id,
                s.StartAt,
                s.EndAt,
                s.TimeZone
            })
            .ToListAsync();

        return Ok(new
        {
            provider.Id,
            provider.DisplayName,
            provider.Headline,
            provider.Bio,
            provider.ServiceArea,
            provider.PricingNotes,
            portfolioItems,
            availabilitySlots
        });
    }
}
