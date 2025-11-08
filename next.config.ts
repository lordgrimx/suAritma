import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'readdy.ai',
      },
      {
        protocol: 'https',
        hostname: 'www.conax.com.tr',
      },
      {
        protocol: 'https',
        hostname: 'aquagerman.com',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mekaniktesisatmarket.com',
      },
      {
        protocol: 'https',
        hostname: 'www.thewaterguy.ca',
      },
      {
        protocol: 'https',
        hostname: 'd1yjjnpx0p53s8.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
