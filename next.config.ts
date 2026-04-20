import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
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
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "media.edusanjal.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "kist.edu.np",
      },
      {
        protocol: "https",
        hostname: "trinity.edu.np",
      },
      {
        protocol: "https",
        hostname: "www.trinity.edu.np",
      },
      {
        protocol: "https",
        hostname: "advancefoundation.edu.np",
      },
      {
        protocol: "https",
        hostname: "goldengateintl.com",
      },
      {
        protocol: "https",
        hostname: "www.goldengateintl.com",
      },
      {
        protocol: "https",
        hostname: "media.w3.org",
      },
    ],
  },
};

export default nextConfig;
