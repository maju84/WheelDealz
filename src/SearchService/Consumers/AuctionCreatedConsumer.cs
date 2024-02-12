using AutoMapper;
using Contracts;
using MassTransit;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Consumers;

public class AuctionCreatedConsumer : IConsumer<AuctionCreated>
{
    private readonly IMapper _mapper;

    public AuctionCreatedConsumer(IMapper mapper)
    {
        _mapper = mapper;
    }

  
    public async Task Consume(ConsumeContext<AuctionCreated> context)
    {
        Console.WriteLine(" --> consuming AuctionCreated event: " + context.Message.Id);

        var item = _mapper.Map<Item>(context.Message);

        if (item.Model.ToLower() == "quuxfoobar") throw new ArgumentException("Invalid model name!");

        await item.SaveAsync();
    }
}