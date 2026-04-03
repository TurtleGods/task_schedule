namespace TaskSchedule.Api.Infrastructure.Auth;

public static class AuthorizationPolicies
{
    public const string AdminOnly = "AdminOnly";
    public const string ProviderOnly = "ProviderOnly";
    public const string ClientOnly = "ClientOnly";
}
