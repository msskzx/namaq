import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/quran/shifts', destination: '/quran', permanent: true }];
  },
};

export default nextConfig;
