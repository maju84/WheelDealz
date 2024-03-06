# Use the SDK image for building the project - *not* Alpine due to grpc issues
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy the necessary project files
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]
COPY ["src/BidService/BidService.csproj", "BidService/"]

# Restore dependencies
RUN dotnet restore "BidService/BidService.csproj"

# Copy the source code and build the project
COPY ["src/Contracts/", "Contracts/"]
COPY ["src/BidService/", "BidService/"]
WORKDIR "/app/BidService"
RUN dotnet publish "BidService.csproj" -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BidService.dll"]
