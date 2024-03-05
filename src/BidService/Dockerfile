# Use the SDK image for building the project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the necessary project files
COPY ["src/BidService/BidService.csproj", "BidService/"]
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]

# Restore dependencies
RUN dotnet restore "BidService/BidService.csproj"

# Copy the source code and build the project
COPY src/ .
WORKDIR "/src/BidService"
RUN dotnet publish "BidService.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BidService.dll"]
