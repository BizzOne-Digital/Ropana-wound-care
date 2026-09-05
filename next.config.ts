import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploaded images are served from this app's own /api/uploads/** route, so
    // they are local paths rather than a remote host. localPatterns keeps
    // next/image optimisation working for them while restricting which local
    // paths the optimiser will accept.
    localPatterns: [
      { pathname: "/api/uploads/**", search: "" },
      { pathname: "/placeholder-image.svg", search: "" },
      // Brand artwork derived from the client logo.
      { pathname: "/Logo/**", search: "" },
    ],
    remotePatterns: [
      // Seeded stand-in photography, until the client's own images arrive.
      { protocol: "https", hostname: "picsum.photos" },
    ],
  },
  serverExternalPackages: ["mongoose"],
};

export default nextConfig;
