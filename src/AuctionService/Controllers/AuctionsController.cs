using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuctionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly AuctionDbContext _context;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public AuctionsController(AuctionDbContext context, IMapper mapper,
            IPublishEndpoint publishEndpoint)
        {
            _context = context;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
        }      

    


        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _context.Auctions
                .Include(a => a.Item)
                .OrderBy(a => a.EndsAt)    // todo - parameterize ordering criteria
                .ToListAsync();

            var auctionDtos = _mapper.Map<List<AuctionDto>>(auctions);

            return Ok(auctionDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
        {
            var auction = await _context.Auctions
                .Include(a => a.Item)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (auction == null)
            {
                return NotFound();
            }

            var auctionDto = _mapper.Map<AuctionDto>(auction);

            return Ok(auctionDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
        {
            var auction = _mapper.Map<Auction>(createAuctionDto);
            
            auction.Seller = User.Identity.Name;

            _context.Auctions.Add(auction);

            var newAuction = _mapper.Map<AuctionDto>(auction);
            await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuction));

            var result = await _context.SaveChangesAsync() > 0;
            
            if (!result)
            {
                return BadRequest("Failed to create auction.");
            }
            
            return CreatedAtAction(
                nameof(GetAuctionById), 
                new { auction.Id }, 
                newAuction);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
        {
            var auction = await _context.Auctions
                .Include(a => a.Item)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (auction == null)
            {
                return NotFound();
            }

            if (auction.Seller != User.Identity.Name)
            {
                return Forbid();
            }

            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;

            // Create and publish the AuctionUpdated event before saving changes
            var auctionUpdatedEvent = _mapper.Map<AuctionUpdated>(auction);
            await _publishEndpoint.Publish(auctionUpdatedEvent);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest("Failed to update auction.");
            }

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions
                .FindAsync(id);

            if (auction == null)
            {
                return NotFound();
            }

            if (auction.Seller != User.Identity.Name)
            {
                return Forbid();
            }

            _context.Auctions.Remove(auction);
      
            // Directly create and publish the AuctionDeleted event before saving changes
            var auctionDeletedEvent = new AuctionDeleted { Id = auction.Id };
            await _publishEndpoint.Publish(auctionDeletedEvent);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest("Failed to delete auction.");
            }

            return Ok();
        }

    }

}
