using AuctionService.Data;
using AuctionService.IntegrationTests.Utils;
using MassTransit;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Testcontainers.PostgreSql;

namespace AuctionService.IntegrationTests.Fixtures;

/*
 * CustomWebAppFactory is a core component for integration testing in the AuctionService application,
 * extending WebApplicationFactory<Program> to create a test server that simulates the app's runtime environment.
 * It customizes the ASP.NET Core host for tests, adjusting services to use in-memory databases or test containers,
 * and configuring dependencies like MassTransit with test harnesses. This ensures tests run in isolation, using
 * fresh database states and mocked dependencies to prevent test side effects and achieve reproducible results.
 *
 * The factory overrides ConfigureWebHost to modify service configurations, such as replacing the DbContext
 * for database tests and setting up a test environment that mirrors the production environment closely but
 * is tailored for testing. Through the IAsyncLifetime interface, it manages async setup and cleanup, like
 * database container lifecycle management, facilitating a controlled test environment setup.
 */
public class CustomWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    private PostgreSqlContainer _postgreSqlContainer = new PostgreSqlBuilder().Build();


    public async Task InitializeAsync()
    {
        await _postgreSqlContainer.StartAsync();
    }


    /*  even though first entire AuctionSvc' Program class is loaded,
     *  in this method we can replace the relevant parts of the configuration
     */
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {   
        builder.ConfigureTestServices(services => 
        {
            // Remove the existing DbContextOptions service registration
            services.RemoveDbContext();

            // Add a new DbContext with a connection to the PostgreSQL test container
            services.AddDbContext<AuctionDbContext>(options =>
            {
                options.UseNpgsql(_postgreSqlContainer.GetConnectionString());
            });


            // Add MassTransit test harness for messaging components testing
            // internally replaces the MassTransit service registration with the MassTransitTestHarness
            services.AddMassTransitTestHarness();

            // todo add 1-2 line/s explaining 
            services.EnsureCreatedAndSeeded();

            
        });
    }

    Task IAsyncLifetime.DisposeAsync() => _postgreSqlContainer.DisposeAsync().AsTask();
}