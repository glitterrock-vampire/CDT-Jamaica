module.exports = {
  async headers() {
    return [
      {
        // Matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  },
  env: {
    // These environment variables will be available on the client side
    // They will be replaced at build time with the values from Vercel
    SANITY_PROJECT_ID: process.env.REACT_APP_SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.REACT_APP_SANITY_DATASET || 'production',
    SANITY_API_VERSION: '2023-05-03',
  },
  // Enable React Strict Mode
  reactStrictMode: true,
}
