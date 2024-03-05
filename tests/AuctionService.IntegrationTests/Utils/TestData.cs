using AuctionService.DTOs;

namespace AuctionService.IntegrationTests.Utils;

public static class TestData    // todo maybe bring together db init
{
    public static CreateAuctionDto GetTestAuction()
    {
        return new CreateAuctionDto
        {
            Make = "British Motor Corporation (BMC)",
            Model = "Mini Cooper MKII",
            Year = 1967,
            Color = "British Green",
            Mileage = 12345,
            ImageUrl = "https://cdn.pixabay.com/photo/2017/07/19/00/02/british-racing-green-2517484_1280.jpg",
            EndsAt = DateTime.UtcNow.AddDays(1),
            ReservePrice = 7000,            
        };
    }
}