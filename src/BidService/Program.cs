using BiddingService.Consumers;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using MongoDB.Driver;
using MongoDB.Entities;

// Define constant for service name
const string BidServiceName = "bid-svc";


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// MassTransit
builder.Services.AddMassTransit(x =>
{
    // all consumers in the same namespace as AuctionCreatedConsumer are added
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();    

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(BidServiceName, false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ConfigureEndpoints(context);
    });
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["IdentityServiceUrl"];
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters.ValidateAudience = false;
        options.TokenValidationParameters.NameClaimType = "username";
    });

builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

var app = builder.Build();

// app.UseAuthentication();
app.UseAuthorization();

await DB.InitAsync("BidDb", MongoClientSettings
    .FromConnectionString(builder.Configuration.GetConnectionString("BidDbConnection"))
);

app.MapControllers();

app.Run();
