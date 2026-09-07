import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keeps the dev overlay badge out of design review screenshots.
  devIndicators: false,
  images: {
    // AU logo assets are hotlinked from au.int for the prototype only.
    // Production must serve locally-hosted copies supplied by AU comms.
    remotePatterns: [{ protocol: "https", hostname: "au.int" }],
  },
};

export default nextConfig;
