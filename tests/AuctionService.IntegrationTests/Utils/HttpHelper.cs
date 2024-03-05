using System.Text;
using Newtonsoft.Json;

namespace AuctionService.IntegrationTests.Utils;

public static class HttpHelper
{
    public const string ContentTypeJson = "application/json";
    public static HttpContent DtoToJsonContent<T>(T dto)
    {
        var json = JsonConvert.SerializeObject(dto);
        return new StringContent(json, Encoding.UTF8, ContentTypeJson);
    }
}