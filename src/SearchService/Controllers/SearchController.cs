using Microsoft.AspNetCore.Mvc;
using MongoDB.Entities;
using SearchService.Models;
using SearchService.RequestHelpers;

namespace SearchService;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<Item>>> SearchItem([FromQuery] SearchParams searchParams)    
    {
        var query = DB.PagedSearch<Item, Item>();

        query = ApplyFilters(query, searchParams);
        query = ApplySorting(query, searchParams);    

        query.PageNumber(searchParams.PageNumber);
        query.PageSize(searchParams.PageSize);

        var result = await query.ExecuteAsync();
            
        return Ok(new {
            results = result.Results,
            pageCount = result.PageCount,
            totalCount = result.TotalCount
        } );
    }

    private PagedSearch<Item, Item> ApplyFilters(PagedSearch<Item, Item> query, SearchParams searchParams)
    {
        if (!string.IsNullOrEmpty(searchParams.Seller))
        {
            query.Match(x => x.Seller == searchParams.Seller);
        }

        if (!string.IsNullOrEmpty(searchParams.Winner))
        {
            query.Match(x => x.Winner == searchParams.Winner);
        }

        query = searchParams.FilterBy switch
        {
            "finished" => query.Match(x => x.EndsAt < DateTime.UtcNow),
            "endingSoon" => query.Match(x => x.EndsAt > DateTime.UtcNow && x.EndsAt < DateTime.UtcNow.AddHours(8)),
            _ => query.Match(x => x.EndsAt > DateTime.UtcNow)
        };

        if (!string.IsNullOrEmpty(searchParams.SearchTerm))
        {
            query.Match(Search.Full, searchParams.SearchTerm).SortByTextScore();
        }

        return query;
    }

    private PagedSearch<Item, Item> ApplySorting(PagedSearch<Item, Item> query, SearchParams searchParams)
    {
        // set up a sort order based on the the searchParams.OrderBy value
        return searchParams.OrderBy switch
        {
            // if it is "make", then sort by make
            "make" => query.Sort(x => x.Ascending(i => i.Make)),

            // "new", then sort by newest
            "new" => query.Sort(x => x.Descending(i => i.CreatedAt)),

            // anything else, sort by ending soonest (default)
            _ => query.Sort(x => x.Ascending(i => i.EndsAt)) 
        };

    }
}