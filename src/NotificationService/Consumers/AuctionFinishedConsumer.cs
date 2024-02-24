using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class AuctionFinishedConsumer : IConsumer<AuctionFinished>
{
    private const string AUCTION_FINISHED = "AuctionFinished";    // fixme magic string
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<AuctionFinishedConsumer> _logger;

    public AuctionFinishedConsumer(IHubContext<NotificationHub> hubContext, ILogger<AuctionFinishedConsumer> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<AuctionFinished> context)
    {
        _logger.LogInformation(" ---- received {AuctionFinished} message for Auction {AuctionId}", 
            AUCTION_FINISHED, context.Message.AuctionId);

    
        await _hubContext.Clients.All.SendAsync(AUCTION_FINISHED, context.Message);
    }
}
