using System.Net;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

[Collection("Shared collection")]
public class AuctionsControllerTests : IAsyncLifetime
{   
    private readonly CustomWebAppFactory _factory;
    private readonly HttpClient _httpClient;

    public AuctionsControllerTests(CustomWebAppFactory factory)
    {
        _factory = factory;
        _httpClient = factory.CreateClient();
    }

        // IAsyncLifetime - *not* a fixture so it's *not* shared but run before each test
    public Task InitializeAsync() => Task.CompletedTask;

    // IAsyncLifetime - run after each test
    public Task DisposeAsync() 
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AuctionDbContext>();
        DbHelper.ReinitializeDbForTests(db);
        return Task.CompletedTask;
    }



    [Fact]
    public async Task GetAuctions_ShouldReturn_3Auctions()
    {
        // Arrange        

        // Act
        var auctionDtos = await _httpClient.GetFromJsonAsync<List<AuctionDto>>(TestConstants.Endpoint);

        // Assert
        Assert.Equal(3, auctionDtos?.Count);
    }

    [Fact]
    public async Task GetAuctionById_WithValidId_ShouldReturn_Auction()
    {
        // Arrange

        // Act
        var auctionDto = await _httpClient.GetFromJsonAsync<AuctionDto>($"{TestConstants.Endpoint}/{TestConstants.BugattiVeyronId}");

        // Assert
        Assert.Equal("Bugatti", auctionDto?.Make);
        Assert.Equal("Veyron", auctionDto?.Model);
        Assert.Equal(TestConstants.BugattiVeyronId, auctionDto?.Id.ToString());
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidId_ShouldReturn_NotFound()
    {
        // Arrange

        // Act
        var response = await _httpClient.GetAsync($"{TestConstants.Endpoint}/{Guid.NewGuid()}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAuctionById_WithNotEvenAGuid_ShouldReturn_BadRequest()
    {
        // Arrange

        // Act
        var response = await _httpClient.GetAsync($"{TestConstants.Endpoint}/NotEvenAGuid");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }



    [Fact]
    public async Task CreateAuction_WithNoAuth_ShouldReturn_Unauthorized()
    {
        // Arrange
        var auction = new CreateAuctionDto { Make = "Won't Matter" };

        // Act
        var response = await _httpClient.PostAsJsonAsync(TestConstants.Endpoint, auction);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateAuction_WithAuth_ShouldReturn_Created()
    {
        // Arrange
        var auction = TestData.GetTestAuction();        
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(TestConstants.MrBeanUser));

        // Act
        var response = await _httpClient.PostAsJsonAsync(TestConstants.Endpoint, auction);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var returnedAuctionDto = await response.Content.ReadFromJsonAsync<AuctionDto>();
        Assert.Equal(TestConstants.MrBeanUser, returnedAuctionDto.Seller);
    }
    
    [Fact]
    public async Task CreateAuction_WithInvalidCreateAuctionDto_ShouldReturn_BadRequest()
    {
        // Arrange
        var auction = TestData.GetTestAuction();
        auction.Make = null;
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(TestConstants.MrBeanUser));

        // Act
        var response = await _httpClient.PostAsJsonAsync(TestConstants.Endpoint, auction);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndUser_ShouldReturn_Ok()
    {
        // Arrange
        var updateAuction = new UpdateAuctionDto { Make = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(TestConstants.AliceUser));

        // Act
        var response = await _httpClient.PutAsJsonAsync($"{TestConstants.Endpoint}/{TestConstants.BugattiVeyronId}", updateAuction);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UpdateAuction_WithValidUpdateDtoAndInvalidUser_ShouldReturn_Forbidden()
    {
        // Arrange
        var updateAuction = new UpdateAuctionDto { Make = "Updated" };
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(TestConstants.MrBeanUser));    // *not* bob

        // Act
        var response = await _httpClient.PutAsJsonAsync($"{TestConstants.Endpoint}/{TestConstants.BugattiVeyronId}", updateAuction);

        // Assert
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }


 


}
