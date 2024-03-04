using System.Net;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.IntegrationTests.Fixtures;
using AuctionService.IntegrationTests.Utils;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

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
        var request = new HttpRequestMessage(HttpMethod.Get, _endpoint);      

        // Act
        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        var auctions = JsonConvert.DeserializeObject<List<AuctionDto>>(content);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(3, auctions?.Count);
    }

    [Fact]
    public async Task GetAuctionById_WithValidId_ShouldReturn_Auction()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_endpoint}/{_bugattiVeyronId}");      

        // Act
        var response = await _httpClient.SendAsync(request);
        var content = await response.Content.ReadAsStringAsync();
        var auction = JsonConvert.DeserializeObject<AuctionDto>(content);

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Bugatti", auction?.Make);
        Assert.Equal("Veyron", auction?.Model);
        Assert.Equal(_bugattiVeyronId, auction?.Id.ToString());
    }


    [Fact]
    public async Task GetAuctionById_WithInvalidId_ShouldReturn_NotFound()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_endpoint}/{Guid.NewGuid()}");      

        // Act
        var response = await _httpClient.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetAuctionById_WithNotEvenAGuid_ShouldReturn_BadRequest()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Get, $"{_endpoint}/NotEvenAGuid");      

        // Act
        var response = await _httpClient.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

 


}
