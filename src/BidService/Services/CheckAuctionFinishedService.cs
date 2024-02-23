

using BidService.Models;
using Contracts;
using MassTransit;
using MongoDB.Entities;

namespace BidService.Services;


/// <summary>
/// Implements a background service to periodically check for and process finished auctions,
/// aligning with the scalable and resource-efficient "chosen approach". This service polls the database
/// at intervals defined by CHECK_PERIOD_IN_SECONDS, optimizing resource use and scalability. It avoids
/// the inefficiencies of continuous polling by performing targeted checks, ensuring the system remains
/// responsive and efficient as it scales.
/// </summary>

public class CheckAuctionFinishedService : BackgroundService
{
    const int CHECK_PERIOD_IN_SECONDS = 5;

    private readonly ILogger<CheckAuctionFinishedService> _logger;
    private readonly IServiceProvider _serviceProvider;

    public CheckAuctionFinishedService(ILogger<CheckAuctionFinishedService> logger, IServiceProvider serviceProvider)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting to check for finished auctions");

        // todo whats that stoppingToken
        stoppingToken.Register(
            () => _logger.LogInformation(" --- Check for finished auctions is stopping"));

    
        // CancellationToken allows for cooperative cancellation of this background task,
        // enabling the service to stop gracefully by terminating ongoing operations 
        // like database queries.
        while(!stoppingToken.IsCancellationRequested)
        {
            await CheckAuctions(stoppingToken);

            await Task.Delay(CHECK_PERIOD_IN_SECONDS * 1000, stoppingToken);  // 
        }
    }

    private async Task CheckAuctions(CancellationToken stoppingToken)
    {
        var finishedAuctions = await DB.Find<Auction>()
            .Match(a => !a.Finished)
            .Match(a => a.EndsAt < DateTime.UtcNow)            
            .ExecuteAsync(stoppingToken);

        if (finishedAuctions.Count == 0) return;
       
        _logger.LogInformation(" --- Found {count} auctions that needs to be finished", finishedAuctions.Count);


        // Creating a new DI scope for each operation ensures that scoped services are properly 
        // disposed, preventing memory leaks and ensuring a clean set of dependencies for each 
        // task execution.
        // DI scope starts right after this and ends at the end of the using block
        using var scope = _serviceProvider.CreateScope();   
        
        var endpoint = scope.ServiceProvider.GetRequiredService<IPublishEndpoint>();

        foreach (var auction in finishedAuctions)
        {
            auction.Finished = true;
            await auction.SaveAsync(null, stoppingToken);

            var winningBid = await DB.Find<Bid>()
                .Match(bid => bid.AuctionId.Equals(Guid.Parse(auction.ID)))
                .Match(bid => bid.BidStatus == BidStatus.Accepted)
                .Sort(x => x.Descending(bid => bid.Amount))
                .ExecuteFirstAsync(stoppingToken);
        

            await endpoint.Publish(new AuctionFinished
            {
                ItemSold = winningBid != null,
                AuctionId = Guid.Parse(auction.ID),
                Winner = winningBid?.Bidder,
                Amount = winningBid?.Amount,
                Seller = auction.Seller
            }, stoppingToken);
        }

    }   // end of scope
}
