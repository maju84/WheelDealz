using MassTransit;
using SearchService.Consumers;
using SearchService.Data;

var builder = WebApplication.CreateBuilder(args);


// Define constant for service name
const string SearchServiceName = "search-svc";


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// MassTransit
builder.Services.AddMassTransit(x =>
{
    // all consumers in the same namespace as AuctionCreatedConsumer are added
    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();    

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(SearchServiceName, false));

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration["RabbitMq:Host"], "/", host =>
        {
            host.Username(builder.Configuration.GetValue("RabbitMq:Username", "guest"));
            host.Password(builder.Configuration.GetValue("RabbitMq:Password", "guest"));
        });

        cfg.ReceiveEndpoint($"{SearchServiceName}-auction-created", e => 
        {
            e.UseMessageRetry(r => r.Interval(5, 5));   // 5 times, 5s between each try

            e.ConfigureConsumer<AuctionCreatedConsumer>(context);
        });
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

try {
    await DbInitializer.InitializeDB(app);
} 
catch (Exception e) 
{
    Console.WriteLine(e);
}

app.Run();
