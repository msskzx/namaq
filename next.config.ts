import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/quran/shifts', destination: '/quran/compare', permanent: true },
      { source: '/quran', has: [{ type: 'query', key: 's' }], destination: '/quran/compare', permanent: true },
      { source: '/quran/musa', destination: '/quran/prophets/musa', permanent: true },
      { source: '/references', destination: '/attributions', permanent: true },
    ];
  },
};

export default nextConfig;
