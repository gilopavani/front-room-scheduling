import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_JWT_ACCESS_TOKEN_SECRET: process.env.NEXT_JWT_ACCESS_TOKEN_SECRET,
  },
};

export default nextConfig;
