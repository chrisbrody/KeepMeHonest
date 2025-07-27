import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    webpack: (config, { isServer }) => {
        config.module.exprContextCritical = false;

        // Exclude problematic packages from Edge Runtime
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                path: false,
                crypto: false,
                stream: false,
                os: false,
            };
        }

        return config;
    }
};

export default nextConfig;
