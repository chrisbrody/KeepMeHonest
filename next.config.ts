import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr']
  },
  webpack: (config, { isServer }) => {
    config.module.exprContextCritical = false;
    
    // Fix for __dirname not defined in Edge Runtime
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }

    return config;
  }
};

export default nextConfig;
