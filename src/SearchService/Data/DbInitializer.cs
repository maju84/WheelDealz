using System.Text.Json;
using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;

namespace SearchService.Data;

public class DbInitializer{

    public static async Task InitializeDB(WebApplication app)
    {
        await DB.InitAsync("SearchDb", MongoClientSettings
            .FromConnectionString(app.Configuration.GetConnectionString("MongoDbConnection"))
        );

        // create the indexes for Make, Model and Color to enable text search
        await DB.Index<Item>()
            .Key(a => a.Make, KeyType.Text)
            .Key(a => a.Model, KeyType.Text)
            .Key(a => a.Color, KeyType.Text)
            .CreateAsync(); // non-blocking to avoid slowing down the app startup


        // Index for sorting by "make"
        await DB.Index<Item>()
            .Key(a => a.Make, KeyType.Ascending) // First sort by "Make"
            .Key(a => a.Model, KeyType.Ascending) // Then by "Model"
            .Key(a => a.EndsAt, KeyType.Ascending) // Then by "EndsAt"
            .Key(a => a.ID, KeyType.Ascending) // Finally by "_id" for uniqueness
            .Option(o => o.Background = true)
            .CreateAsync();

        // Index for sorting by "new"
        await DB.Index<Item>()
            .Key(a => a.CreatedAt, KeyType.Descending) // First sort by "CreatedAt"
            .Key(a => a.EndsAt, KeyType.Ascending) // Then by "EndsAt"
            .Key(a => a.ID, KeyType.Ascending) // Finally by "_id" for uniqueness
            .Option(o => o.Background = true)
            .CreateAsync();

        // Index for default sorting (when "orderBy" is not "make" or "new")
        await DB.Index<Item>()
            .Key(a => a.EndsAt, KeyType.Ascending) // Sort by "EndsAt"
            .Key(a => a.ID, KeyType.Ascending) // Then by "_id" for uniqueness
            .Option(o => o.Background = true)
            .CreateAsync();

        var count = await DB.CountAsync<Item>();

        if (count == 0){
            Console.WriteLine("Seeding data...");   // todo - proper logging
            var itemData = await File.ReadAllTextAsync("Data/auctions.json");

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
            };

            var items = JsonSerializer.Deserialize<List<Item>>(itemData, options);

            await DB.InsertAsync(items);
        }


    }
}