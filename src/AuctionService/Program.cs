using AuctionService.Consumers;
using AuctionService.Data;
using AuctionService.Services;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

// Define constant for service name
const string AuctionServiceName = "auction-svc";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);


/*  Registers the AuctionRepository with a scoped lifetime to the application's services, 
    ensuring a new instance is created for each HTTP request. 
    This aligns the lifecycle of the AuctionRepository with that of the DbContext it depends on, 
    facilitating efficient database connection and transaction management. 
    Scoped services like this are crucial for maintaining data integrity and resource efficiency
    across individual requests within the web application. 
*/
builder.Services.AddScoped<IAuctionRepository, AuctionRepository>();

/* 
    AppDomain.CurrentDomain.GetAssemblies(): 
    This is getting all the assemblies loaded in the current application domain. 
    AutoMapper uses this to scan for profiles (classes that inherit from Profile),
    where you define your mappings. 
    By passing this to AddAutoMapper, you're telling AutoMapper to scan all loaded assemblies for profiles.
*/
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddEntityFrameworkOutbox<AuctionDbContext>(o =>
    {
        o.QueryDelay = TimeSpan.FromSeconds(10);
        o.UsePostgres();
        o.UseBusOutbox();
    });

    x.AddConsumersFromNamespaceContaining<AuctionCreatedFaultConsumer>();
    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(AuctionServiceName, false));

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

// Add services to the container.
builder.Services.AddGrpc();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthentication(); // must be called before UseAuthorization!!!
app.UseAuthorization();

app.MapControllers();
app.MapGrpcService<GrpcAuctionService>();

try
{
    DbInitializer.InitializeDB(app);
}
catch (Exception e)
{
    Console.WriteLine(e);
}

app.Run();
