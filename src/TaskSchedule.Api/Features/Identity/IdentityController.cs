using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using TaskSchedule.Api.Contracts.Identity;
using TaskSchedule.Api.Domain.Entities;
using TaskSchedule.Api.Infrastructure.Auth;
using TaskSchedule.Api.Infrastructure.Identity;
using TaskSchedule.Api.Infrastructure.Persistence;

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
        [FromServices] UserManager<ApplicationUser> userManager,
        [FromServices] ApplicationDbContext dbContext)
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

        if (request.Role == "Provider")
        {
            dbContext.ProviderProfiles.Add(new ProviderProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                DisplayName = request.DisplayName,
                IsPublished = false,
            });
        }
        else if (request.Role == "Client")
        {
            dbContext.ClientProfiles.Add(new ClientProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                DisplayName = request.DisplayName,
            });
        }

        await dbContext.SaveChangesAsync();

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
    [Authorize(Policy = AuthorizationPolicies.AdminOnly)]
    public async Task<IActionResult> AssignRole(
        [FromBody] AssignRoleRequest request,
        [FromServices] UserManager<ApplicationUser> userManager,
        [FromServices] ApplicationDbContext dbContext)
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

        if (request.Role == "Provider" && !await dbContext.ProviderProfiles.AnyAsync(x => x.UserId == user.Id))
        {
            dbContext.ProviderProfiles.Add(new ProviderProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                DisplayName = user.DisplayName ?? user.Email ?? "Provider",
                IsPublished = false,
            });
        }

        if (request.Role == "Client" && !await dbContext.ClientProfiles.AnyAsync(x => x.UserId == user.Id))
        {
            dbContext.ClientProfiles.Add(new ClientProfile
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                DisplayName = user.DisplayName ?? user.Email ?? "Client",
            });
        }

        await dbContext.SaveChangesAsync();

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

    [HttpGet("google/login")]
    [AllowAnonymous]
    public IActionResult GoogleLogin([FromServices] IConfiguration configuration, [FromQuery] string? returnUrl = "/")
    {
        var clientId = configuration["Authentication:Google:ClientId"];
        var clientSecret = configuration["Authentication:Google:ClientSecret"];
        if (string.IsNullOrWhiteSpace(clientId) || string.IsNullOrWhiteSpace(clientSecret))
        {
            return BadRequest(new { error = "Google login is not configured." });
        }

        var redirectUrl = Url.ActionLink(nameof(GoogleCallback), values: new { returnUrl })!;
        var properties = new AuthenticationProperties
        {
            RedirectUri = redirectUrl
        };

        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google/callback")]
    [AllowAnonymous]
    public async Task<IActionResult> GoogleCallback(
        [FromQuery] string? returnUrl,
        [FromServices] SignInManager<ApplicationUser> signInManager,
        [FromServices] UserManager<ApplicationUser> userManager)
    {
        var externalLoginInfo = await signInManager.GetExternalLoginInfoAsync();
        if (externalLoginInfo is null)
        {
            return BadRequest(new { error = "Failed to load Google login information." });
        }

        var signInResult = await signInManager.ExternalLoginSignInAsync(
            externalLoginInfo.LoginProvider,
            externalLoginInfo.ProviderKey,
            isPersistent: false,
            bypassTwoFactor: true);

        if (!signInResult.Succeeded)
        {
            var email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email);
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new { error = "Google account email is unavailable." });
            }

            var user = await userManager.FindByEmailAsync(email);
            if (user is null)
            {
                user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = email,
                    Email = email,
                    DisplayName = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Name) ?? email,
                    EmailConfirmed = true,
                    TimeZone = "Asia/Taipei"
                };

                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return BadRequest(new
                    {
                        error = "Failed to create local user for Google login.",
                        details = createResult.Errors.Select(x => x.Description)
                    });
                }

                await userManager.AddToRoleAsync(user, "Client");
            }

            var linkResult = await userManager.AddLoginAsync(user, externalLoginInfo);
            if (!linkResult.Succeeded)
            {
                return BadRequest(new
                {
                    error = "Failed to link Google login.",
                    details = linkResult.Errors.Select(x => x.Description)
                });
            }

            await signInManager.SignInAsync(user, isPersistent: false);
            var roles = await userManager.GetRolesAsync(user);

            return Ok(new
            {
                message = "Google login linked and sign-in succeeded.",
                returnUrl = returnUrl ?? "/",
                user.Id,
                user.Email,
                user.DisplayName,
                Roles = roles
            });
        }

        var signedInUser = await userManager.GetUserAsync(User);
        if (signedInUser is null)
        {
            var email = externalLoginInfo.Principal.FindFirstValue(ClaimTypes.Email);
            if (!string.IsNullOrWhiteSpace(email))
            {
                signedInUser = await userManager.FindByEmailAsync(email);
            }
        }

        if (signedInUser is null)
        {
            return Ok(new { message = "Google sign-in succeeded.", returnUrl = returnUrl ?? "/" });
        }

        var signedInRoles = await userManager.GetRolesAsync(signedInUser);

        return Ok(new
        {
            message = "Google sign-in succeeded.",
            returnUrl = returnUrl ?? "/",
            signedInUser.Id,
            signedInUser.Email,
            signedInUser.DisplayName,
            Roles = signedInRoles
        });
    }
}
