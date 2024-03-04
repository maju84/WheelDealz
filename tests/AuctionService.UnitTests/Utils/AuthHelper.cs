using System.Security.Claims;

namespace AuctionService.UnitTests.Utils;

public class AuthHelper
{

    public static ClaimsPrincipal GetClaimsPrincipal()
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, "testuser"),
        };

        var identity = new ClaimsIdentity(claims, "TestAuthType");
        return new ClaimsPrincipal(identity);
    }
}