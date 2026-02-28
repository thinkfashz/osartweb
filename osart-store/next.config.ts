import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bplifywjbhtwzcplxksg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        // Allow any https image source (covers CDN-hosted product images)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: '/api/graphql',
      },
      {
        source: '/health',
        destination: 'https://osartweb-ltg8-git-main-think-fastzs-projects.vercel.app/health',
      },
      {
        source: '/api/backend/:path*',
        destination: 'https://osartweb-ltg8-git-main-think-fastzs-projects.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
