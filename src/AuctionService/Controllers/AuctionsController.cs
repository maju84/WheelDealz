using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
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

        public AuctionsController(AuctionDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }      

    


        [HttpGet]
        public async Task<ActionResult<List<AuctionDto>>> GetAllAuctions()
        {
            var auctions = await _context.Auctions
                .Include(a => a.Item)
                .OrderBy(a => a.EndedAt)    // todo - parameterize ordering criteria
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

            var result = await _context.SaveChangesAsync() > 0;
            
            if (!result)
            {
                return BadRequest("Failed to create auction.");
            }

            return CreatedAtAction(
                nameof(GetAuctionById), 
                new { auction.Id }, 
                _mapper.Map<AuctionDto>(auction));
        }
    }

}
