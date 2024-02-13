using Duende.IdentityServer.Models;

namespace IdentityService;

public static class Config
{
    public static IEnumerable<IdentityResource> IdentityResources =>
        new IdentityResource[]
        {
            // allows to get access token and id token that contains the info about the user
            new IdentityResources.OpenId(), 
            new IdentityResources.Profile(),
        };

    public static IEnumerable<ApiScope> ApiScopes =>
        new ApiScope[]
        {
            new ApiScope("auction-app", "Auction ap full access"),
        };

    public static IEnumerable<Client> Clients =>
        new Client[]
        {
            // a client config for development purposes only!
            new Client
            {
                ClientId = "postman",
                ClientName = "Postman",
                AllowedScopes = { "openid", "profile", "auction-app" },

                // postman won't be redirected to any url but for the sake of the example we will use the postman callback url
                RedirectUris = { "https://www.getpostman.com/oauth2/callback" },    
                ClientSecrets = new [] {new Secret("NotSoSecret".Sha256())},
                AllowedGrantTypes = {GrantType.ResourceOwnerPassword},
            }
        };
}
