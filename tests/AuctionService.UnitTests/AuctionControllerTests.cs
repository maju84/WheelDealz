using AuctionService.Constants;
using AuctionService.Controllers;
using AuctionService.Data;
using AuctionService.DTOs;
using AuctionService.Entities;
using AuctionService.RequestHelpers;
using AuctionService.UnitTests.Utils;
using AutoFixture;
using AutoMapper;
using MassTransit;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace AuctionService.UnitTests;

public class AuctionControllerTests
{
    private readonly Mock<IAuctionRepository> _mockAuctionRepo;
    private readonly Mock<IPublishEndpoint> _mockPublishEndpoint;
    private readonly Fixture _fixture;
    private readonly AuctionsController _controller;

    private readonly IMapper _mapper;


    public AuctionControllerTests()
    {
        _mockAuctionRepo = new Mock<IAuctionRepository>();
        _mockPublishEndpoint = new Mock<IPublishEndpoint>();

        _fixture = new Fixture();

        var mapperConfig = new MapperConfiguration(cfg =>
        {
            cfg.AddProfile<MappingProfiles>();
        });
        _mapper = mapperConfig.CreateMapper();

        _controller = new AuctionsController(_mockAuctionRepo.Object, _mapper, _mockPublishEndpoint.Object)
        {
            // Setting up the ControllerContext to mimic an HTTP request environment
            ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext
                {
                    // Setting the User property to simulate an authenticated user
                    // AuthHelper.GetClaimsPrincipal() is used to generate a ClaimsPrincipal
                    // This simulates the user's identity and roles, if any, for the request
                    User = AuthHelper.GetClaimsPrincipal()
                }
            }
        };
    }

    [Fact]
    public async Task GetAllAuctions_WithNoParams_Returns10Auctions()
    {
        // Arrange
        const int expectedAuctionCount = 10;
        var auctions = _fixture.CreateMany<AuctionDto>(expectedAuctionCount).ToList();
        _mockAuctionRepo.Setup(repo => repo.GetAuctionsAsync(AuctionDefaults.DefaultLimit)).ReturnsAsync(auctions);

        // Act
        var result = await _controller.GetAllAuctions();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedAuctions = Assert.IsType<List<AuctionDto>>(okResult.Value);
        Assert.Equal(expectedAuctionCount, returnedAuctions.Count);
    }

    [Fact]
    public async Task GetAuctionById_WithValidGuid_ReturnsAuction()
    {
        // Arrange       
        var auction = _fixture.Create<AuctionDto>();
        _mockAuctionRepo.Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>())).ReturnsAsync(auction);

        // Act
        var result = await _controller.GetAuctionById(auction.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedAuction = Assert.IsType<AuctionDto>(okResult.Value);
        Assert.Equal(auction.Make, returnedAuction.Make);
    }

    [Fact]
    public async Task GetAuctionById_WithInvalidGuid_ReturnsNotFound()
    {
        // Arrange       
        _mockAuctionRepo.Setup(repo => repo.GetAuctionByIdAsync(It.IsAny<Guid>())).ReturnsAsync(null as AuctionDto);

        // Act
        var result = await _controller.GetAuctionById(Guid.NewGuid());

        // Assert
        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task CreateAuction_WithValidCreateAuctionDto_ReturnsCreatedAtActionResult()
    {
        // Arrange
        var createAuctionDto = _fixture.Create<CreateAuctionDto>();
        _mockAuctionRepo.Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
        _mockAuctionRepo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(true);

        // Act
        var result = await _controller.CreateAuction(createAuctionDto);

        // Assert
        var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        Assert.Equal(nameof(AuctionsController.GetAuctionById), createdAtActionResult.ActionName);        
        var returnedAuctionDto = Assert.IsType<AuctionDto>(createdAtActionResult.Value);
    }

    [Fact]
    public async Task CreateAuction_WithSaveFailed_ReturnsBadRequest()
    {
        // Arrange
        var createAuctionDto = _fixture.Create<CreateAuctionDto>();
        _mockAuctionRepo.Setup(repo => repo.AddAuction(It.IsAny<Auction>()));
        _mockAuctionRepo.Setup(repo => repo.SaveChangesAsync()).ReturnsAsync(false);

        // Act
        var result = await _controller.CreateAuction(createAuctionDto);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }


}