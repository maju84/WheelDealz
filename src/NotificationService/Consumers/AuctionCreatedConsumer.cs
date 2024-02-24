using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private const string AUCTION_CREATED = "AuctionCreated";    // fixme magic string

    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<AuctionCreatedConsumer> _logger;

    public AuctionCreatedConsumer(IHubContext<NotificationHub> hubContext, ILogger<AuctionCreatedConsumer> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        _logger.LogInformation(" ---- received {AuctionCreated} message for Auction {AuctionId}", 
            AUCTION_CREATED, context.Message.Id);

    
        await _hubContext.Clients.All.SendAsync(AUCTION_CREATED, context.Message);  
    }
}
