import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/quran/shifts', destination: '/quran', permanent: true },
      { source: '/quran/musa', destination: '/quran/prophets/musa', permanent: true },
    ];
  },
};

export default nextConfig;
