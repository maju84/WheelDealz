﻿using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;
using MassTransit;
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

        [HttpPost]
        public async Task<ActionResult<AuctionDto>> CreateAuction(CreateAuctionDto createAuctionDto)
        {
            var auction = _mapper.Map<Auction>(createAuctionDto);

            // todo - current user is the seller
            auction.Seller = "todo-current-user";

            _context.Auctions.Add(auction);

            // once our auction has been created and stored, we want to publish an event
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

            // todo - check that current user is seller

            auction.Item.Make = updateAuctionDto.Make ?? auction.Item.Make;
            auction.Item.Model = updateAuctionDto.Model ?? auction.Item.Model;
            auction.Item.Year = updateAuctionDto.Year ?? auction.Item.Year;
            auction.Item.Color = updateAuctionDto.Color ?? auction.Item.Color;
            auction.Item.Mileage = updateAuctionDto.Mileage ?? auction.Item.Mileage;
        

            _context.Auctions.Update(auction);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest("Failed to update auction.");
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteAuction(Guid id)
        {
            var auction = await _context.Auctions
                .FindAsync(id);

            if (auction == null)
            {
                return NotFound();
            }

            // todo - check that current user is seller

            _context.Auctions.Remove(auction);

            var result = await _context.SaveChangesAsync() > 0;

            if (!result)
            {
                return BadRequest("Failed to delete auction.");
            }

            return Ok();
        }

    }

}
