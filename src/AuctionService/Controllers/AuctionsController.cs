using AuctionService.Constants;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AuctionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuctionsController : ControllerBase
    {
        private readonly IAuctionRepository _auctionRepo;
        private readonly IMapper _mapper;
        private readonly IPublishEndpoint _publishEndpoint;

        public AuctionsController(IAuctionRepository auctionRepository, IMapper mapper,
            IPublishEndpoint publishEndpoint)
        {
            _auctionRepo = auctionRepository;
            _mapper = mapper;
            _publishEndpoint = publishEndpoint;
        }      

    


        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions(int limit = AuctionDefaults.DefaultLimit)
        {
            var auctions = await _auctionRepo.GetAuctionsAsync(limit);
            return Ok(auctions);
        }
       

        [HttpGet("{id}")]
        public async Task<ActionResult<AuctionDto>> GetAuctionById(Guid id)
        {
            var auctionDto = await _auctionRepo.GetAuctionByIdAsync(id);

            if (auctionDto == null) return NotFound();

            return Ok(auctionDto);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
        {
            var auction = _mapper.Map<Auction>(createAuctionDto);
            
            auction.Seller = User.Identity.Name;

            _auctionRepo.AddAuction(auction);

            var newAuctionDto = _mapper.Map<AuctionDto>(auction);
            await _publishEndpoint.Publish(_mapper.Map<AuctionCreated>(newAuctionDto));

            var result = await _auctionRepo.SaveChangesAsync();
            
            if (!result) return BadRequest("Failed to create auction.");
            
            return CreatedAtAction(
                nameof(GetAuctionById), 
                new { auction.Id }, 
                newAuctionDto);
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAuction(Guid id, UpdateAuctionDto updateAuctionDto)
        {
            var auction = await _auctionRepo.GetAuctionEntityByIdAsync(id);

            if (auction == null) return NotFound();

            if (auction.Seller != User.Identity.Name)return Forbid();

            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;

            // Create and publish the AuctionUpdated event before saving changes
            var auctionUpdatedEvent = _mapper.Map<AuctionUpdated>(auction);
            await _publishEndpoint.Publish(auctionUpdatedEvent);

            var result = await _auctionRepo.SaveChangesAsync();

            if (!result) return BadRequest("Failed to update auction.");

            return Ok();
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _auctionRepo.GetAuctionEntityByIdAsync(id);

            if (auction == null) return NotFound();

            if (auction.Seller != User.Identity.Name) return Forbid();

            _auctionRepo.RemoveAuction(auction);
      
            // Directly create and publish the AuctionDeleted event before saving changes
            var auctionDeletedEvent = new AuctionDeleted { Id = auction.Id };
            await _publishEndpoint.Publish(auctionDeletedEvent);

            var result = await _auctionRepo.SaveChangesAsync();

            if (!result) return BadRequest("Failed to delete auction.");

            return Ok();
        }

    }

}
