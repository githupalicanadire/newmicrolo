using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Shopping.Web.Pages;

public class AuthTestModel : PageModel
{
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthTestModel> _logger;

    public AuthTestModel(IUserService userService, IConfiguration configuration, ILogger<AuthTestModel> logger)
    {
        _userService = userService;
        _configuration = configuration;
        _logger = logger;
    }

    public string UserId { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string UserEmail { get; set; } = default!;
    public string CustomerId { get; set; } = default!;
    public string IdentityServerUrl { get; set; } = default!;
    public string GatewayUrl { get; set; } = default!;
    public string? ErrorMessage { get; set; }

    public void OnGet(string? error = null)
    {
        try
        {
            // Get user information
            UserId = _userService.GetUserId();
            UserName = _userService.GetUserName();
            UserEmail = _userService.GetUserEmail();
            CustomerId = _userService.GetCustomerId().ToString();

            // Get configuration
            IdentityServerUrl = _configuration["IdentityServer:BaseUrl"] ?? "Not configured";
            GatewayUrl = _configuration["ApiSettings:GatewayAddress"] ?? "Not configured";

            // Handle error messages
            ErrorMessage = error switch
            {
                "authentication_failed" => "Authentication failed. Please try again.",
                "remote_failure" => "Remote authentication failure. Check Identity Server configuration.",
                "invalid_token" => "Invalid or expired token. Please login again.",
                _ => null
            };

            _logger.LogInformation("AuthTest page accessed by user: {UserName}, IsAuthenticated: {IsAuthenticated}", 
                UserName, User.Identity?.IsAuthenticated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in AuthTest page");
            ErrorMessage = $"Error loading user information: {ex.Message}";
        }
    }
}
