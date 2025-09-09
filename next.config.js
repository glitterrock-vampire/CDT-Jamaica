/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Environment variables
  env: {
    // Your environment variables here
  },
  // Webpack configuration
  webpack: (config) => {
    // Add any custom webpack configurations here
    return config;
  },
};

module.exports = nextConfig;
