using AuctionService.Data;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AuctionDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
);

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

    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();

try
{
    DbInitializer.InitializeDB(app);
}
catch (Exception e)
{
    Console.WriteLine(e);
}

app.Run();
