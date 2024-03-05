FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY src/GatewayService/GatewayService.csproj src/GatewayService/
COPY src/Contracts/Contracts.csproj src/Contracts/
RUN dotnet restore "src/GatewayService/GatewayService.csproj"

# Copy everything else and build
COPY src/ src/
WORKDIR "/app/src/GatewayService"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GatewayService.dll"]
