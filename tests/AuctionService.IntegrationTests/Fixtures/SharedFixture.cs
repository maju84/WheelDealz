using AuctionService.IntegrationTests.Fixtures;

namespace AuctionService.IntegrationTests;

/*
 * The SharedFixture class is a collection definition for integration tests in the AuctionService application,
 * leveraging xUnit's shared context feature. By associating tests with the "Shared collection", it enables
 * the reuse of the CustomWebAppFactory setup across multiple test classes without reinitializing the test
 * environment for each test. 
 * This approach is motivated by the need to efficiently manage resources like test databases and service 
 * configurations, ensuring tests run in a consistent environment while minimizing setup and teardown overhead.
 */
[CollectionDefinition("Shared collection")]
public class SharedFixture : ICollectionFixture<CustomWebAppFactory>
{

}
