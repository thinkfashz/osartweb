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
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        // Allow any https image source (fallback)
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // Proxies explicit backend modules to the NestJS application.
    // We avoid a global `/api/(.*)` to prevent conflicts with local Next.js routes like `/api/graphql`.
    const backendUrl = 'https://osartweb-ltg8-git-main-think-fastzs-projects.vercel.app';

    return [
      {
        source: '/graphql',
        destination: '/api/graphql', // Handled by local Next.js route
      },
      {
        source: '/health',
        destination: `${backendUrl}/health`,
      },
      // Backend Modules
      { source: '/api/products/:path*', destination: `${backendUrl}/api/products/:path*` },
      { source: '/api/categories/:path*', destination: `${backendUrl}/api/categories/:path*` },
      { source: '/api/cart/:path*', destination: `${backendUrl}/api/cart/:path*` },
      { source: '/api/orders/:path*', destination: `${backendUrl}/api/orders/:path*` },
      { source: '/api/auth/:path*', destination: `${backendUrl}/api/auth/:path*` },
      { source: '/api/users/:path*', destination: `${backendUrl}/api/users/:path*` },
      { source: '/api/payments/:path*', destination: `${backendUrl}/api/payments/:path*` },
      { source: '/api/coupons/:path*', destination: `${backendUrl}/api/coupons/:path*` },
      { source: '/api/seed/:path*', destination: `${backendUrl}/api/seed/:path*` },
      { source: '/api/stock/:path*', destination: `${backendUrl}/api/stock/:path*` },
      { source: '/api/system/:path*', destination: `${backendUrl}/api/system/:path*` },
      { source: '/api/wishlist/:path*', destination: `${backendUrl}/api/wishlist/:path*` },
      // Fallback namespace
      {
        source: '/api/backend/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
