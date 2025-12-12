/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // <--- CRITICAL FOR DOCKER
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, // Fail open during deploy
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  }
};

export default nextConfig;