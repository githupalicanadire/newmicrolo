using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Identity.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestController : ControllerBase
{
    private readonly ILogger<TestController> _logger;

    public TestController(ILogger<TestController> logger)
    {
        _logger = logger;
    }

    [HttpGet("auth-status")]
    public IActionResult GetAuthStatus()
    {
        var isAuthenticated = User?.Identity?.IsAuthenticated ?? false;
        var userName = User?.Identity?.Name ?? "Anonymous";

        var claims = User?.Claims?.Select(c => new { c.Type, c.Value }).ToList();

        var result = new
        {
            IsAuthenticated = isAuthenticated,
            UserName = userName,
            Claims = claims ?? new List<object>(),
            AuthenticationType = User?.Identity?.AuthenticationType ?? "None",
            Timestamp = DateTime.UtcNow
        };

        _logger.LogInformation("Auth status check - Authenticated: {IsAuthenticated}, User: {UserName}",
            isAuthenticated, userName);

        return Ok(result);
    }

    [HttpGet("force-query")]
    public IActionResult ForceQueryMode([FromQuery] string returnUrl)
    {
        if (string.IsNullOrEmpty(returnUrl))
        {
            return BadRequest("returnUrl is required");
        }

        // Force response_mode to query
        if (returnUrl.Contains("response_mode=form_post"))
        {
            returnUrl = returnUrl.Replace("response_mode=form_post", "response_mode=query");
        }
        else if (!returnUrl.Contains("response_mode="))
        {
            var separator = returnUrl.Contains("?") ? "&" : "?";
            returnUrl = $"{returnUrl}{separator}response_mode=query";
        }

        _logger.LogInformation("Forcing query mode redirect to: {ReturnUrl}", returnUrl);

        return Redirect(returnUrl);
    }
}
