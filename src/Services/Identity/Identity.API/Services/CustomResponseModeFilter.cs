using IdentityServer4.Endpoints.Results;
using IdentityServer4.Hosting;
using Microsoft.AspNetCore.Http;

namespace Identity.API.Services;

public class CustomResponseModeFilter : IEndpointFilter
{
    private readonly ILogger<CustomResponseModeFilter> _logger;

    public CustomResponseModeFilter(ILogger<CustomResponseModeFilter> logger)
    {
        _logger = logger;
    }

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        // Check if this is an authorization request
        if (context.HttpContext.Request.Path.StartsWithSegments("/connect/authorize"))
        {
            var responseMode = context.HttpContext.Request.Query["response_mode"].ToString();

            if (responseMode == "form_post")
            {
                _logger.LogWarning("Blocking form_post response mode, forcing query mode");

                // Replace form_post with query in the query string
                var queryString = context.HttpContext.Request.QueryString.ToString();
                if (queryString.Contains("response_mode=form_post"))
                {
                    queryString = queryString.Replace("response_mode=form_post", "response_mode=query");
                    // Parse the query string and rebuild it
                    var query = Microsoft.AspNetCore.WebUtilities.QueryHelpers.ParseQuery(queryString);
                    var newQuery = new Dictionary<string, Microsoft.Extensions.Primitives.StringValues>();

                    foreach (var item in query)
                    {
                        if (item.Key == "response_mode")
                        {
                            newQuery[item.Key] = "query";
                        }
                        else
                        {
                            newQuery[item.Key] = item.Value;
                        }
                    }

                    context.HttpContext.Request.QueryString = QueryString.Create(newQuery);
                }
            }
        }

        return await next(context);
    }
}
