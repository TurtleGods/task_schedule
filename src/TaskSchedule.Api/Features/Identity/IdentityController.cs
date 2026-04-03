using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TaskSchedule.Api.Contracts.Identity;
using TaskSchedule.Api.Infrastructure.Identity;

namespace TaskSchedule.Api.Features.Identity;

[ApiController]
[Route("api/identity")]
public class IdentityController : ControllerBase
{
    private static readonly HashSet<string> AllowedRoles = ["Provider", "Client", "Admin"];

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register(
        [FromBody] RegisterRequest request,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        if (!AllowedRoles.Contains(request.Role))
        {
            return BadRequest(new { error = "Invalid role." });
        }

        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            return Conflict(new { error = "Email already registered." });
        }

        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.Email,
            Email = request.Email,
            DisplayName = request.DisplayName,
            TimeZone = string.IsNullOrWhiteSpace(request.TimeZone) ? "Asia/Taipei" : request.TimeZone,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return BadRequest(new
            {
                error = "Failed to register user.",
                details = createResult.Errors.Select(x => x.Description)
            });
        }

        var addRoleResult = await userManager.AddToRoleAsync(user, request.Role);
        if (!addRoleResult.Succeeded)
        {
            return BadRequest(new
            {
                error = "User created but failed to assign role.",
                details = addRoleResult.Errors.Select(x => x.Description)
            });
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.DisplayName,
            Role = request.Role
        });
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(
        [FromBody] LoginRequest request,
        [FromServices] SignInManager<ApplicationUser> signInManager,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
        {
            return Unauthorized(new { error = "Invalid credentials." });
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: false);
        if (!result.Succeeded)
        {
            return Unauthorized(new { error = "Invalid credentials." });
        }

        var roles = await userManager.GetRolesAsync(user);

        return Ok(new
        {
            message = "Credentials validated.",
            user.Id,
            user.Email,
            user.DisplayName,
            Roles = roles
        });
    }

    [HttpPost("assign-role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AssignRole(
        [FromBody] AssignRoleRequest request,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        if (!Guid.TryParse(request.UserId, out var userId))
        {
            return BadRequest(new { error = "Invalid user id." });
        }

        if (!AllowedRoles.Contains(request.Role))
        {
            return BadRequest(new { error = "Invalid role." });
        }

        var user = await userManager.FindByIdAsync(userId.ToString());
        if (user is null)
        {
            return NotFound(new { error = "User not found." });
        }

        if (await userManager.IsInRoleAsync(user, request.Role))
        {
            return Ok(new { message = "Role already assigned." });
        }

        var result = await userManager.AddToRoleAsync(user, request.Role);
        if (!result.Succeeded)
        {
            return BadRequest(new
            {
                error = "Failed to assign role.",
                details = result.Errors.Select(x => x.Description)
            });
        }

        return Ok(new { message = "Role assigned successfully." });
    }

    [HttpGet("google/configured")]
    [AllowAnonymous]
    public IActionResult GoogleConfigured(IConfiguration configuration)
    {
        var clientId = configuration["Authentication:Google:ClientId"];
        var clientSecret = configuration["Authentication:Google:ClientSecret"];

        return Ok(new
        {
            configured = !string.IsNullOrWhiteSpace(clientId) && !string.IsNullOrWhiteSpace(clientSecret)
        });
    }
}
