using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionUpdatedConsumer : IConsumer<AuctionUpdated>
{
    private readonly IMapper _mapper;

    public AuctionUpdatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

  
    public async Task Consume(ConsumeContext<AuctionUpdated> context)
    {
        var message = context.Message;

        Console.WriteLine(" --> consuming AuctionUpdated event: " + message.Id);

        var item = _mapper.Map<Item>(message);  

        var result = await DB.Update<Item>()
            .MatchID(message.Id) // .Match(i => i.ID == message.Id) - what's the functional difference?
            .ModifyOnly(i => new { i.Make, i.Model, i.Year, i.Color, i.Mileage }, item)
            .ExecuteAsync();

        if (!result.IsAcknowledged)
        {
            throw new MessageException(typeof(AuctionUpdated), $"Failed to update item with id: {message.Id}.");
        }

        Console.WriteLine($"Item updated from AuctionUpdated event: {message.Id}");
    
    }
}