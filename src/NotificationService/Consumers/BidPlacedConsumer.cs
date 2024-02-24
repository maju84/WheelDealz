using Contracts;
using MassTransit;
using Microsoft.AspNetCore.SignalR;
using NotificationService.Hubs;

namespace NotificationService.Consumers;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    private const string BID_PLACED = "BidPlaced";    // fixme magic string
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly ILogger<BidPlacedConsumer> _logger;

    public BidPlacedConsumer(IHubContext<NotificationHub> hubContext, ILogger<BidPlacedConsumer> logger)
    {
        _hubContext = hubContext;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        _logger.LogInformation(" ---- received {BidPlaced} message for Auction {AuctionId}", 
            BID_PLACED, context.Message.AuctionId);

    
        await _hubContext.Clients.All.SendAsync(BID_PLACED, context.Message);
    }
}
