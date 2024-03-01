/** @type {import('next').NextConfig} */
const nextConfig = {

    // Configure external image domains
    images: {
      // Allows images to be loaded from specified external domains.
      remotePatterns: [
        { hostname: 'cdn.pixabay.com' },
      ]
    },

    // Configure logging for fetch requests
    logging: {
      fetches: {
        fullUrl: true,  // Log the full URL of fetch requests for better debugging
      },
    },
    
    // Output configuration for the build
    output: 'standalone',
    // The 'standalone' option configures Next.js to output a self-contained build.
    // This includes all necessary dependencies, making it suitable for environments
    // where a Node.js server is available but without needing to install node_modules.
    // It simplifies deployment by packaging the application and its dependencies together.

}
export default nextConfig;
