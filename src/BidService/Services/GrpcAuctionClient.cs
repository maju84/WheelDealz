using BidService.Models;
using BidService.Protos;
using Grpc.Core;
using Grpc.Net.Client;

namespace BidService.Services;

public class GrpcAuctionClient
{
    private readonly IConfiguration _config;
    private readonly ILogger<GrpcAuctionClient> _logger;

    private GRPCAuction.GRPCAuctionClient _client;

    public GrpcAuctionClient(IConfiguration config, ILogger<GrpcAuctionClient> logger)
    {
        _config = config;
        _logger = logger;

        // Initialize the GRPC client once during construction to avoid creating new channels for each request.
        var channel = GrpcChannel.ForAddress(_config["GrpcAuctionServiceUrl"]); // Updated key to be more descriptive
        _client = new GRPCAuction.GRPCAuctionClient(channel);
    }
    
    public Auction GetAuction(Guid id)
        {
            _logger.LogInformation(" ---- GetAuction called with id: {Id}", id);

            var request = new GetAuctionRequest { Id = id.ToString() };

            try {
                var response = _client.GetAuction(request);
                return new Auction
                {
                    ID = response.Auction.Id,
                    EndsAt = response.Auction.AuctionEnd.ToDateTime(),
                    ReservePrice = response.Auction.ReservePrice,
                    Seller = response.Auction.Seller
                };
            }
            catch (RpcException ex) when (ex.StatusCode == StatusCode.NotFound)
            {
                _logger.LogWarning("Auction not found for ID: {Id}", id);
                return null; // Explicitly return null to indicate not found
            } 
            catch (RpcException ex)
            {
                _logger.LogError(ex, "Error calling GetAuction for ID: {Id}", id);
                throw; // Consider rethrowing to let the caller handle or log the exception
            }
        }
}