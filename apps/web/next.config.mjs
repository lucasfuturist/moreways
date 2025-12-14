/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", 
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true, 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // [NEW] Rewrite rules to proxy Console API requests
  async rewrites() {
    const consoleUrl = process.env.NEXT_PUBLIC_CONSOLE_URL || "http://localhost:3001";
    return [
      {
        source: "/api/console/:path*",
        destination: `${consoleUrl}/api/:path*`, // Proxy to Console
      },
    ];
  },
};

export default nextConfig;