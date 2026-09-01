import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Security headers and optimization
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Security headers (managed via headers() in middleware or vercel.json)
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  }
};

export default nextConfig;
