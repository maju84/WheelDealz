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
        
        Console.WriteLine(" --> consuming AuctionDeleted event: " + context.Message.Id);
        await DB.DeleteAsync<Item>(auctionDeleted.Id.ToString());
    }
}