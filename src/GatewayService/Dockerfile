# Use the SDK image for building the project - Alpine version
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY ["src/GatewayService/GatewayService.csproj", "GatewayService/"]

# Restore dependencies
RUN dotnet restore "GatewayService/GatewayService.csproj"


# Copy only the relevant source code and build the project
COPY ["src/GatewayService/", "GatewayService/"]
WORKDIR "/app/GatewayService"
RUN dotnet publish "GatewayService.csproj" -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "GatewayService.dll"]
