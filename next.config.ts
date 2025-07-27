import type { NextConfig } from "next";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@supabase/ssr']
  }
};

export default nextConfig;
