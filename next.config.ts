import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "connect-src 'self' https://api.studsphere.com https://ai.studsphere.com http://localhost:8080 https://placehold.co https://images.unsplash.com https://api.qrserver.com;",
          },
        ],
      },
    ];
  },
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "ui-avatars.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "media.edusanjal.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "kist.edu.np" },
      { protocol: "https", hostname: "trinity.edu.np" },
      { protocol: "https", hostname: "www.trinity.edu.np" },
      { protocol: "https", hostname: "advancefoundation.edu.np" },
      { protocol: "https", hostname: "goldengateintl.com" },
      { protocol: "https", hostname: "www.goldengateintl.com" },
      { protocol: "https", hostname: "media.w3.org" },
      { protocol: "https", hostname: "projectshiksha.hundredgroupnepal.org" },
      { protocol: "https", hostname: "sowersaction.org.np" },
      { protocol: "https", hostname: "api.qrserver.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "api.studsphere.com" },
      { protocol: "https", hostname: "ai.studsphere.com" },
    ],
  },
  allowedDevOrigins: ["petersburg-inside-grande-llp.trycloudflare.com"],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@phosphor-icons/react",
      "react-icons",
      "date-fns",
      "framer-motion",
    ],
  },
};

export default nextConfig;
