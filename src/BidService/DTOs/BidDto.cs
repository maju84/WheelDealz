namespace BidService.DTOs;

public class BidDto
{
    public Guid Id { get; set; }
    public Guid AuctionId { get; set; }
    public string Bidder { get; set; }        
    public DateTime BidTime { get; set; }
    public decimal Amount { get; set; }
    public string BidStatus { get; set; }
}
