using System.Security.Claims;

namespace Shopping.Web.Services;

public interface IUserService
{
    string GetUserName();
    string GetUserId();
    string GetUserEmail();
    bool IsAuthenticated();
    Guid GetCustomerId();
    ClaimsPrincipal? GetCurrentUser();
    bool ValidateUserOwnership(string resourceUserId);
    string GetSecureUserIdentifier();

    // Legacy method aliases for backward compatibility
    string GetCurrentUserName();
    string GetCurrentUserId();
    string GetCurrentUserEmail();
}

public class UserService : IUserService
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<UserService> _logger;

    public UserService(IHttpContextAccessor httpContextAccessor, ILogger<UserService> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public string GetUserName()
    {
        var identity = _httpContextAccessor.HttpContext?.User?.Identity as ClaimsIdentity;

        if (identity != null && identity.IsAuthenticated)
        {
            var userName = identity.FindFirst(ClaimTypes.Name)?.Value
                ?? identity.FindFirst("name")?.Value
                ?? identity.FindFirst("preferred_username")?.Value
                ?? identity.FindFirst(ClaimTypes.Email)?.Value;

            if (!string.IsNullOrEmpty(userName))
            {
                _logger.LogDebug("Retrieved username: {UserName}", userName);
                return userName;
            }
        }

        _logger.LogDebug("User not authenticated or username not found, returning Anonymous");
        return "Anonymous";
    }

    public string GetUserId()
    {
        var identity = _httpContextAccessor.HttpContext?.User?.Identity as ClaimsIdentity;

        if (identity != null && identity.IsAuthenticated)
        {
            var userId = identity.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? identity.FindFirst("sub")?.Value
                ?? identity.FindFirst("user_id")?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                _logger.LogDebug("Retrieved user ID: {UserId}", userId);
                return userId;
            }
        }

        // For development/testing - generate consistent ID based on email
        var email = GetUserEmail();
        if (!string.IsNullOrEmpty(email) && email != "anonymous@test.com")
        {
            return GenerateConsistentIdFromEmail(email);
        }

        _logger.LogDebug("User ID not found, returning default");
        return "anonymous_user";
    }

    public string GetUserEmail()
    {
        var identity = _httpContextAccessor.HttpContext?.User?.Identity as ClaimsIdentity;

        if (identity != null && identity.IsAuthenticated)
        {
            var email = identity.FindFirst(ClaimTypes.Email)?.Value
                ?? identity.FindFirst("email")?.Value;

            if (!string.IsNullOrEmpty(email))
            {
                _logger.LogDebug("Retrieved user email: {Email}", email);
                return email;
            }
        }

        _logger.LogDebug("User email not found, returning default");
        return "anonymous@test.com";
    }

    public Guid GetCustomerId()
    {
        var userId = GetUserId();

        // Try to parse as GUID first
        if (Guid.TryParse(userId, out var guidId))
        {
            return guidId;
        }

        // Generate consistent GUID from user identifier
        if (!string.IsNullOrEmpty(userId) && userId != "anonymous_user")
        {
            return GenerateConsistentGuidFromString(userId);
        }

        // Default anonymous customer ID
        return Guid.Parse("00000000-0000-0000-0000-000000000001");
    }

    public bool IsAuthenticated()
    {
        var isAuth = _httpContextAccessor.HttpContext?.User?.Identity?.IsAuthenticated ?? false;
        _logger.LogDebug("User authentication status: {IsAuthenticated}", isAuth);
        return isAuth;
    }

    public ClaimsPrincipal? GetCurrentUser()
    {
        return _httpContextAccessor.HttpContext?.User;
    }

    public bool ValidateUserOwnership(string resourceUserId)
    {
        var currentUserId = GetUserId();
        var isValid = !string.IsNullOrEmpty(currentUserId) &&
               currentUserId.Equals(resourceUserId, StringComparison.OrdinalIgnoreCase);

        _logger.LogDebug("User ownership validation - Current: {CurrentUserId}, Resource: {ResourceUserId}, Valid: {IsValid}",
            currentUserId, resourceUserId, isValid);

        return isValid;
    }

    public string GetSecureUserIdentifier()
    {
        if (!IsAuthenticated())
        {
            throw new UnauthorizedAccessException("User is not authenticated");
        }

        var userId = GetUserId();
        if (string.IsNullOrEmpty(userId) || userId == "anonymous_user")
        {
            throw new InvalidOperationException("Cannot determine user identity");
        }

        return userId;
    }

    private string GenerateConsistentIdFromEmail(string email)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(email));
        return Convert.ToBase64String(hash)[..16]; // Take first 16 characters
    }

    private Guid GenerateConsistentGuidFromString(string input)
    {
        using var sha256 = System.Security.Cryptography.SHA256.Create();
        var hash = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
        var guidBytes = hash.Take(16).ToArray();
        return new Guid(guidBytes);
    }

    // Legacy method implementations for backward compatibility
    public string GetCurrentUserName() => GetUserName();
    public string GetCurrentUserId() => GetUserId();
    public string GetCurrentUserEmail() => GetUserEmail();
}
