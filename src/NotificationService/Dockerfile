# Use the SDK image for building the project - Alpine version
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
WORKDIR /app

# Copy the necessary project files
COPY ["src/Contracts/Contracts.csproj", "Contracts/"]
COPY ["src/NotificationService/NotificationService.csproj", "NotificationService/"]

# Restore dependencies
RUN dotnet restore "NotificationService/NotificationService.csproj"

# Copy only the relevant source code and build the project
COPY ["src/Contracts", "Contracts/"]
COPY ["src/NotificationService", "NotificationService/"]
WORKDIR "/app/NotificationService"
RUN dotnet publish NotificationService.csproj -c Release -o /app/publish

# Build the runtime image - Alpine version
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS final
WORKDIR /app
EXPOSE 80
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NotificationService.dll"]
