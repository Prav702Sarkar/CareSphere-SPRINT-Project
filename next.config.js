/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['bcryptjs'],
  compress: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ['lucide-react', '@clerk/nextjs', 'date-fns', 'zod'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (dev) {
      // High-performance in-memory caching to minimize CPU & disk I/O load on Windows
      config.cache = {
        type: 'memory',
      }
    }
    return config
  },
}

module.exports = nextConfig
