/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // TODO: Add your production domain
  // images: {
  //   domains: ['yourdomain.com'],
  // },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Webpack configuration (if needed)
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig;
