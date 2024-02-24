using MassTransit;
using NotificationService.Consumers;
using NotificationService.Hubs;

const string NOTIFICATION_SERVICE_NAME = "notification-svc";
const string NOTIFICATION_HUB_ROUTE_PATTERN = "/notifications";

var builder = WebApplication.CreateBuilder(args);

// MassTransit
builder.Services.AddMassTransit(x =>{ 

    x.AddConsumersFromNamespaceContaining<AuctionCreatedConsumer>();

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(NOTIFICATION_SERVICE_NAME, false));

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

builder.Services.AddSignalR();

var app = builder.Build();

app.MapHub<NotificationHub>(NOTIFICATION_HUB_ROUTE_PATTERN);

app.Run();
