import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['localhost', '127.0.0.1', '192.168.1.2'],
  images: {
    // Next 16 only serves qualities listed here; 90 is for large art (poster, hero poster frame)
    qualities: [75, 90],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'pplx-res.cloudinary.com' },
    ],
  },
};

export default nextConfig;
