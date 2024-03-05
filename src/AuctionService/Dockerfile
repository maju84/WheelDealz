# Use the SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the necessary project files
COPY ["src/AuctionService/AuctionService.csproj", "AuctionService/"]
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]

# Restore dependencies
RUN dotnet restore "AuctionService/AuctionService.csproj"

# Copy the source code and build the project
COPY src/ .
WORKDIR "/src/AuctionService"
RUN dotnet publish "AuctionService.csproj" -c Release -o /app/publish

# Build the runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AuctionService.dll"]
