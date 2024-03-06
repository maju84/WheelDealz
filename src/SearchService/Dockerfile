# Use the SDK image for building the project - Alpine version
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy the necessary project files
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]
COPY ["src/SearchService/SearchService.csproj", "SearchService/"]

# Restore dependencies
RUN dotnet restore "SearchService/SearchService.csproj"

# Copy only the relevant source code and build the project
COPY ["src/Contracts", "Contracts/"]
COPY ["src/SearchService", "SearchService/"]
WORKDIR "/app/SearchService"
RUN dotnet publish "SearchService.csproj" -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SearchService.dll"]
