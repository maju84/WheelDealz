# Use the SDK image for building the project - *not* Aalpine due to grpc issues
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build 
WORKDIR /app

# Copy the necessary project files
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]
COPY ["src/AuctionService/AuctionService.csproj", "AuctionService/"]

# Restore dependencies
RUN dotnet restore "AuctionService/AuctionService.csproj"

# Copy only the relevant source code and build the project
COPY ["src/Contracts", "Contracts/"]
COPY ["src/AuctionService", "AuctionService/"]
WORKDIR "/app/AuctionService"
RUN dotnet publish "AuctionService.csproj" -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AuctionService.dll"]
