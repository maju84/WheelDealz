using MongoDB.Driver;
using MongoDB.Entities;
using SearchService.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

// initialize the database
await DB.InitAsync("SearchDb", MongoClientSettings
    .FromConnectionString(builder.Configuration.GetConnectionString("MongoDbConnection"))
);

// create the indexes for Make, Model and Color to enable text search
await DB.Index<Item>()
    .Key(a => a.Make, KeyType.Text)
    .Key(a => a.Model, KeyType.Text)
    .Key(a => a.Color, KeyType.Text)
    .CreateAsync(); // non-blocking to avoid slowing down the app startup


app.Run();
