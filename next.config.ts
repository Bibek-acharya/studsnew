import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
      root: ".",
    },
  
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
    ],
  },
};

export default nextConfig;
