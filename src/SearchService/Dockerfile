FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY src/SearchService/SearchService.csproj src/SearchService/
COPY src/Contracts/Contracts.csproj src/Contracts/
RUN dotnet restore "src/SearchService/SearchService.csproj"

# Copy everything else and build
COPY src/ src/
WORKDIR "/app/src/SearchService"
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SearchService.dll"]
