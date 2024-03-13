using System.Security.Claims;
using IdentityModel;
using IdentityService.Models;
using Microsoft.AspNetCore.Identity;
using Serilog;

namespace IdentityService;

public class SeedData
{
    private const string _userPassword = "Pass123$"; 

    public static void EnsureSeedData(WebApplication app)
    {
        using var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope();
        var userMgr = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        if (userMgr.Users.Any()) return;

        Log.Information("Seeding database...");
        CreateUser(userMgr, "alice", "Alice Smith", "AliceSmith@email.com");
        CreateUser(userMgr, "bob", "Bob Smith", "BobSmith@email.com");
        Log.Information("Done seeding database. Exiting.");
    }

    private static void CreateUser(UserManager<ApplicationUser> userMgr, string userName, string fullName, string email)
    {
        var user = userMgr.FindByNameAsync(userName).Result;
        if (user == null)
        {
            user = new ApplicationUser
            {
                UserName = userName,
                Email = email,
                EmailConfirmed = true,
            };
            var result = userMgr.CreateAsync(user, _userPassword).Result; // Use the constant here
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.First().Description);
            }

            result = userMgr.AddClaimsAsync(user, [
                new Claim(JwtClaimTypes.Name, fullName),
            ]).Result;
            if (!result.Succeeded)
            {
                throw new Exception(result.Errors.First().Description);
            }
            Log.Debug($"{userName} created");
        }
        else
        {
            Log.Debug($"{userName} already exists");
        }
    }
}
