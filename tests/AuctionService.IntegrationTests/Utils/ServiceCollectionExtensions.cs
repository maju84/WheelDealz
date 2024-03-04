using AuctionService.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests.Utils;

public static class ServiceCollectionExtensions
{
    public static void RemoveDbContext(this IServiceCollection services)
    {
        // Find the existing DbContextOptions service registration
        var descriptor = services.SingleOrDefault(d => 
            d.ServiceType == typeof(DbContextOptions<AuctionDbContext>));
            
        services.Remove(descriptor);
    }


    public static void EnsureCreatedAndSeeded(this IServiceCollection services)
    {
        // Build the service provider to apply configurations
        var sp = services.BuildServiceProvider();

        // Create a new scope to get scoped services
        using var scope = sp.CreateScope();
        var scopedServices = scope.ServiceProvider;
        var db = scopedServices.GetRequiredService<AuctionDbContext>();

        // Apply any pending migrations to the test database to ensure it's up-to-date
        db.Database.EnsureCreated();

        // Seed the database with test data
        DbHelper.InitDbForTests(db);
    }
}