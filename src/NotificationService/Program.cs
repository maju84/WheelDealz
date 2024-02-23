using MassTransit;

const string NotificationServiceName = "notification-svc";

var builder = WebApplication.CreateBuilder(args);

// MassTransit
builder.Services.AddMassTransit(x =>{ 

    x.SetEndpointNameFormatter(new KebabCaseEndpointNameFormatter(NotificationServiceName, false));

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


var app = builder.Build();



app.Run();
