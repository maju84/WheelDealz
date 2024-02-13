using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;


public class AuctionDeletedConsumer : IConsumer<AuctionDeleted>
{  
    public async Task Consume(ConsumeContext<AuctionDeleted> context)
    {
        var auctionDeleted = context.Message;
        
        Console.WriteLine(" --> consuming AuctionDeleted event: " + auctionDeleted.Id);
        var result = await DB.DeleteAsync<Item>(auctionDeleted.Id);

        if (!result.IsAcknowledged)
        {
            throw new MessageException(typeof(AuctionDeleted), $"Failed to delete item with id: {auctionDeleted.Id}.");
        }
    }
}