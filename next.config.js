/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config, { dev, isServer }) => {
    // Disable cache in development to prevent cache-related issues
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig;