using System.Net;
using System.Net.Http.Json;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Utils;
using Microsoft.Extensions.DependencyInjection;

namespace AuctionService.IntegrationTests;

public class AuctionsControllerTests : IClassFixture<CustomWebAppFactory>, IAsyncLifetime
{   
    private readonly CustomWebAppFactory _factory;

    private readonly HttpClient _httpClient;

    private const string _endpoint = "api/auctions";    // todo extract out to central place
    private const string _bugattiVeyronId = "c8c3ec17-01bf-49db-82aa-1ef80b833a9f";     

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
        var auctionDtos = await _httpClient.GetFromJsonAsync<List<AuctionDto>>(_endpoint);

        // Assert
        Assert.Equal(3, auctionDtos?.Count);
    }

    [Fact]
    public async Task GetAuctionById_WithValidId_ShouldReturn_Auction()
    {
        // Arrange

        // Act
        var auctionDto = await _httpClient.GetFromJsonAsync<AuctionDto>($"{_endpoint}/{_bugattiVeyronId}");

        // Assert
        Assert.Equal("Bugatti", auctionDto?.Make);
        Assert.Equal("Veyron", auctionDto?.Model);
        Assert.Equal(_bugattiVeyronId, auctionDto?.Id.ToString());
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidId_ShouldReturn_NotFound()
    {
        // Arrange

        // Act
        var response = await _httpClient.GetAsync($"{_endpoint}/{Guid.NewGuid()}");

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAuctionById_WithNotEvenAGuid_ShouldReturn_BadRequest()
    {
        // Arrange

        // Act
        var response = await _httpClient.GetAsync($"{_endpoint}/NotEvenAGuid");

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }



    [Fact]
    public async Task CreateAuction_WithNoAuth_ShouldReturn_Unauthorized()
    {
        // Arrange
        var auction = new CreateAuctionDto { Make = "Won't Matter" };

        // Act
        var response = await _httpClient.PostAsJsonAsync(_endpoint, auction);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateAuction_WithAuth_ShouldReturn_Created()
    {
        // Arrange
        const string mrBean = "MrBean";
        var auction = TestData.GetTestAuction();        
        _httpClient.SetFakeJwtBearerToken(AuthHelper.GetBearerForUser(mrBean));

        // Act
        var response = await _httpClient.PostAsJsonAsync(_endpoint, auction);

        // Assert
        response.EnsureSuccessStatusCode();
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var returnedAuctionDto = await response.Content.ReadFromJsonAsync<AuctionDto>();
        Assert.Equal(mrBean, returnedAuctionDto.Seller);
    }


 


}
