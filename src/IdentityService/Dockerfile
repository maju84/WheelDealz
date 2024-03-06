# Use the SDK image for building the project - Alpine version
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy the necessary project files
COPY ["src/IdentityService/IdentityService.csproj", "IdentityService/"]

# Restore dependencies
RUN dotnet restore "IdentityService/IdentityService.csproj"

# Copy only the relevant source code and build the project
COPY ["src/IdentityService", "IdentityService/"]
WORKDIR "/app/IdentityService"
RUN dotnet publish "IdentityService.csproj" -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "IdentityService.dll"]
