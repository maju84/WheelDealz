using AuctionService.Constants;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

public class AuctionRepository : IAuctionRepository
{
    private readonly AuctionDbContext _context;
    private readonly IMapper _mapper;

    public AuctionRepository(AuctionDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<List<AuctionDto>> GetAuctionsAsync(int limit = AuctionDefaults.DefaultLimit)
    {
        if (limit <= 0)
            throw new ArgumentOutOfRangeException(nameof(limit), "Limit must be greater than 0");

        var auctionDtos = await _context.Auctions
            .OrderBy(a => a.EndsAt) // Order before limiting to get consistent results
            .Take(limit) // Apply the limit
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .ToListAsync();
            
            return auctionDtos;
    }

    public void AddAuction(Auction auction)
    {
        _context.Auctions.Add(auction);
    }

    public async Task<AuctionDto> GetAuctionByIdAsync(Guid id)
    {
         var auctionDtos = await _context.Auctions
            .ProjectTo<AuctionDto>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(a => a.Id == id);

        return auctionDtos;
    }

    public async Task<Auction> GetAuctionEntityByIdAsync(Guid id)
    {
        var auctions = await _context.Auctions
            .Include(a => a.Item)
            .FirstOrDefaultAsync(a => a.Id == id);

        return auctions;
    }


    public void RemoveAuction(Auction auction)
    {
        _context.Auctions.Remove(auction);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}
