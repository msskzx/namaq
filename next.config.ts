import type { NextConfig } from "next";

const hadithFiles = ["./src/lib/model/fixtures/jibril/data/**/*"];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/hadith": hadithFiles,
    "/hadith/[unit]": hadithFiles,
  },
};

export default nextConfig;
