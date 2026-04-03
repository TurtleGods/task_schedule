using Microsoft.AspNetCore.Identity;

namespace TaskSchedule.Api.Infrastructure.Identity;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? DisplayName { get; set; }
    public string? TimeZone { get; set; }
}
