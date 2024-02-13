using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Services;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;

namespace IdentityService.Services;

public class CustomProfileService : IProfileService
{
    private readonly UserManager<ApplicationUser>  _userManager;

    public CustomProfileService(UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task GetProfileDataAsync(ProfileDataRequestContext context)
    {
        var user = await _userManager.GetUserAsync(context.Subject);
        if (user == null)
        {
            throw new ArgumentException("User not found");
        }
        var existingClaims = await _userManager.GetClaimsAsync(user);
        
        var claims = new List<Claim>
        {
            // we want to use the user name for add info about seller, winner of our auctions
            new Claim("username", user.UserName),
        };

       
        context.IssuedClaims.AddRange(claims);

        // Adds all claims of type JwtClaimTypes.Name from existingClaims to the context's IssuedClaims.
        // This ensures the user's name claim is included in the token, if present.
        // The JwtClaimTypes.Name is a constant that usually represents the "name" claim in a JWT token.
        context.IssuedClaims.AddRange(existingClaims.Where(c => c.Type == JwtClaimTypes.Name));

    }   

    public Task IsActiveAsync(IsActiveContext context)
    {
        return Task.CompletedTask;
    }
    
}