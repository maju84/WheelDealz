using AutoMapper;
using BidService.DTOs;
using BidService.Models;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;

namespace BidService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BidsController : ControllerBase
{
    private readonly IMapper _mapper;
    private readonly IPublishEndpoint _publishEndpoint;

    public BidsController(IMapper mapper, IPublishEndpoint publishEndpoint)
    {
        _mapper = mapper;
        _publishEndpoint = publishEndpoint;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<BidDto>> PlaceBid(Guid auctionId, int amount)
    {
        var auction = await DB.Find<Auction>().OneAsync(auctionId);
        if (auction == null) 
            return BadRequest("Cannot accept bids on this auction at this time");

        if (auction.Seller == User.Identity.Name)
            return BadRequest("You cannot bid on your own auction");

        // Initialize bid with common properties
        var bid = new Bid
        {
            ID = Guid.NewGuid().ToString(), // Manually set the Guid
            Amount = amount,
            AuctionId = auctionId,
            Bidder = User.Identity.Name
        };

        if (auction.EndsAt < DateTime.UtcNow)
        {
            bid.BidStatus = BidStatus.Finished;
            await DB.SaveAsync(bid);
            return BadRequest("The auction has already ended");
        }

        var highBid = await DB.Find<Bid>()
                            .Match(a => a.AuctionId == auctionId)
                            .Sort(b => b.Descending(x => x.Amount))
                            .ExecuteFirstAsync();

        bid.BidStatus = DetermineBidStatus(amount, highBid, auction);
        await DB.SaveAsync(bid);

        


        await _publishEndpoint.Publish(_mapper.Map<BidPlaced>(bid));

        return Ok(_mapper.Map<BidDto>(bid));
    }

    private BidStatus DetermineBidStatus(int amount, Bid highBid, Auction auction)
    {
        if (amount <= (highBid?.Amount ?? 0))
            return BidStatus.TooLow;

        if (amount < auction.ReservePrice)
            return BidStatus.AcceptedBelowReserve;

        return BidStatus.Accepted;
    }

    [HttpGet("{auctionId}")]
    public async Task<ActionResult<List<BidDto>>> GetBidsForAuction(Guid auctionId)
    {
        var bids = await DB.Find<Bid>()
            .Match(a => a.AuctionId == auctionId)
            .Sort(b => b.Descending(a => a.BidTime))
            .ExecuteAsync();

        return bids.Select(_mapper.Map<BidDto>).ToList();
    }

}
