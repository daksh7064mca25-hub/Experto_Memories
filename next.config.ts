import type { NextConfig } from "next";

const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN || "";
const allowedOrigins = [
  "'self'",
  "https://*.myshopify.com",
  "https://*.shopify.com",
  "https://admin.shopify.com",
  shopifyStoreDomain,
]
  .filter(Boolean)
  .join(" ");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    localPatterns: [
      {
        pathname: "/api/media/**",
      },
      {
        pathname: "/api/**",
      },
      {
        pathname: "/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.expertomemories.in",
      },
      {
        protocol: "https",
        hostname: "*.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "*.r2.dev",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/apology",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${allowedOrigins};`,
          },
        ],
      },
      {
        source: "/apology/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${allowedOrigins};`,
          },
        ],
      },
      {
        source: "/demo/anniversary",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${allowedOrigins};`,
          },
        ],
      },
      {
        source: "/demo/anniversary/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${allowedOrigins};`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
