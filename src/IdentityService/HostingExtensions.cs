using Duende.IdentityServer.Services;
using IdentityService.Data;
using IdentityService.Models;
using IdentityService.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace IdentityService;

internal static class HostingExtensions
{

    const string ProdIssuerUri = "https://identity.more-than.tech";
    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddRazorPages();

        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

        builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services
            .AddIdentityServer(options =>
            {
                options.Events.RaiseErrorEvents = true;
                options.Events.RaiseInformationEvents = true;
                options.Events.RaiseFailureEvents = true;
                options.Events.RaiseSuccessEvents = true;

                if (builder.Environment.IsEnvironment("Docker"))
                { 
                    // every time a token is issued from the identity server, we will hardcode the 
                    // issuer uri if the environment is Docker
                    options.IssuerUri = "identity-svc";
                }

                if (builder.Environment.IsProduction())
                {
                    options.IssuerUri = ProdIssuerUri;
                }


                // see https://docs.duendesoftware.com/identityserver/v6/fundamentals/resources/
                // options.EmitStaticAudienceClaim = true; // todo - for now we are not using this
            })
            .AddInMemoryIdentityResources(Config.IdentityResources)
            .AddInMemoryApiScopes(Config.ApiScopes)
            .AddInMemoryClients(Config.Clients(builder.Configuration))
            .AddAspNetIdentity<ApplicationUser>()

            .AddProfileService<CustomProfileService>();
        
        // Configuring the application cookie's SameSite attribute to Lax
        // crucial for ensuring the application's authentication cookies are sent in a third-party context only in a safe manner, 
        // thereby preventing CSRF attacks while allowing simpler cross-site usage scenarios, like single sign-on.
        builder.Services.ConfigureApplicationCookie(options =>
        {
            options.Cookie.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Lax;
        });

        builder.Services.AddAuthentication();

        return builder.Build();
    }
    
    public static WebApplication ConfigurePipeline(this WebApplication app)
    { 
        app.UseSerilogRequestLogging();
    
        if (app.Environment.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();

        if (app.Environment.IsProduction()){
            app.Use(async (context, next) =>
            {
                var serverUrls = context.RequestServices.GetRequiredService<IServerUrls>();
                serverUrls.Origin = serverUrls.Origin = ProdIssuerUri;
                await next();
            });
        }


        app.UseIdentityServer();
        app.UseAuthorization();
        
        app.MapRazorPages()
            .RequireAuthorization();

        return app;
    }
}