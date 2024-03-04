using AuctionService.Constants;
using AuctionService.DTOs;
using AuctionService.Entities;

namespace AuctionService.Data;

public interface IAuctionRepository {
    Task<List<AuctionDto>> GetAuctionsAsync(int limit = AuctionDefaults.DefaultLimit);   // todo - pagination support
    Task<AuctionDto> GetAuctionByIdAsync(Guid id);
    Task<Auction> GetAuctionEntityByIdAsync(Guid id);
    void AddAuction(Auction auction);
    void RemoveAuction(Auction auction);
    Task<bool> SaveChangesAsync();
}