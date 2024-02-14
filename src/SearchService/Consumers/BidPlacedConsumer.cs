namespace SearchService;

public class BidPlacedConsumer : IConsumer<BidPlaced>
{
    

    public async Task Consume(ConsumeContext<BidPlaced> context)
    {
        Console.WriteLine("--> Consuming BidPlaced event");

        var auction = await DB.Find<Item>().OneAsync(context.Message.AuctionId);

        if (context.Message.BidStatus.Contains("Accepted") 
            && context.Message.Amount > auction.CurrentHighBid)
        {
            auction.CurrentHighBid = context.Message.Amount;
            await auction.SaveAsync();
        }
    }

}
