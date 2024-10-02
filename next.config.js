/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add polyfills to both the client and server bundles
    if (!isServer) {
      // Include core-js for general JavaScript polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "fs": false,
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "zlib": require.resolve("browserify-zlib"),
        "process": require.resolve("process/browser"),
      };
    }

    return config;
  },
};

module.exports = nextConfig;