using AuctionService.DTOs;
using AuctionService.Entities;
using AutoMapper;
using Contracts;

namespace AuctionService.RequestHelpers;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {

        // Map from Auction to AuctionDto, including the associated Item
        CreateMap<Auction, AuctionDto>().IncludeMembers(a => a.Item);


        // Map from Item to AuctionDto
        CreateMap<Item, AuctionDto>();


        /*
        * Map from CreateAuctionDto to Auction.
        * Include mapping from CreateAuctionDto itself to Item.
        */
        CreateMap<CreateAuctionDto, Auction>()
            /* This line is configuring how the Item property of the Auction object should be mapped. 
             It's saying that the Item property should be mapped from the source object itself (s => s). 
             This might be a bit confusing, but it's often used when the source object 
             and the destination property are of the same type or when there's 
             a custom conversion operation that should be applied.
            */
            .ForMember(a => a.Item, opt => opt.MapFrom(s => s));


        // Map from CreateAuctionDto to Item
        CreateMap<CreateAuctionDto, Item>();

        // Map from AuctionDto to AuctionCreated for event publishing
        CreateMap<AuctionDto, AuctionCreated>();
    }
}