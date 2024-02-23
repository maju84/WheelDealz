using AuctionService.Data;
using AuctionService.Protos;
using Google.Protobuf.WellKnownTypes;
using Grpc.Core;

namespace AuctionService.Services;

public class GrpcAuctionService : GRPCAuction.GRPCAuctionBase
{ 
    private readonly AuctionDbContext _dbContext;
    private readonly ILogger<GrpcAuctionService> _logger;

    public GrpcAuctionService(AuctionDbContext dbContext, ILogger<GrpcAuctionService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    public override async Task<GetAuctionResponse> GetAuction(GetAuctionRequest request, ServerCallContext context)
    {
        var auctionId = Guid.Parse(request.Id);
        _logger.LogInformation(" ---- GetAuction called with id: {Id}", auctionId);

        var auction = await _dbContext.Auctions.FindAsync(auctionId)
            ??  throw new RpcException(new Status(StatusCode.NotFound, "Auction not found"));

        var response = new GetAuctionResponse
        {
            Auction = new AuctionModel 
            {
                Id = auction.Id.ToString(),
                AuctionEnd = Timestamp.FromDateTime(auction.EndsAt.ToUniversalTime()),
                ReservePrice = auction.ReservePrice,
                Seller = auction.Seller,
            }
        };

        return response;
    }
}