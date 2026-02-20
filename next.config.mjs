/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@tanstack/react-query", "@tanstack/react-virtual", "framer-motion"],
  },
};

export default nextConfig;
