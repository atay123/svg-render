import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/opengraph-image.png",
        destination: "/og-image.png",
        permanent: true,
      },
      {
        source: "/twitter-image.png",
        destination: "/og-image.png",
        permanent: true,
      },
      {
        source: "/opengraph-image",
        destination: "/og-image.png",
        permanent: true,
      },
      {
        source: "/twitter-image",
        destination: "/og-image.png",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
