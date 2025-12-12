/** @type {import('next').NextConfig} */
const nextConfig = {
  // [FIX] Only use standalone mode if explicitly requested (e.g. in Docker)
  // This prevents EPERM symlink errors on Windows during local builds
  output: process.env.STANDALONE_BUILD === "1" ? "standalone" : undefined,

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  async rewrites() {
    return [
      {
        source: '/dashboard',
        destination: '/forms',
      },
    ];
  },
};

export default nextConfig;