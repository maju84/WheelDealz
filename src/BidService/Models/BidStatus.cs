namespace BidService.Models;

public enum BidStatus 
{
    // The bid meets or exceeds the reserve price and is the highest bid so far.
    Accepted,

    // The bid is recorded but doesn't meet the reserve price, though it's the highest bid so far.
    AcceptedBelowReserve,

    // The bid is lower than the highest bid received so far and therefore not competitive.
    TooLow,

    // The bidding process for the auction has concluded, either due to time expiration or other closing conditions.
    Finished
}