using AuctionService.Entities;
using MassTransit;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Data;

public class AuctionDbContext : DbContext
{
    public AuctionDbContext(DbContextOptions<AuctionDbContext> options) : base(options)
    {
    }

    public DbSet<Auction> Auctions { get; set; }

    /// <summary>
    /// Configures the DbContext for MassTransit support, enabling reliable messaging:
    /// - Adds entities for inbox and outbox patterns to ensure idempotency and message durability.
    /// - Facilitates distributed transactions and consistent data across services.
    /// - Extends the database schema for tracking message consumption and production.
    /// </summary>
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }


}
