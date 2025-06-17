using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Shopping.Web.Pages;

public class LogoutModel : PageModel
{
    public async Task<IActionResult> OnGetAsync()
    {
        return await OnPostAsync();
    }

    public IActionResult OnPost()
    {
        // Sign out from both cookies and OIDC
        return SignOut(new AuthenticationProperties
        {
            RedirectUri = "/"
        }, "Cookies", "oidc");
    }
}
