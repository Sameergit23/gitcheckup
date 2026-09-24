/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // No next/image usage, so keep the optimizer endpoint switched off.
  images: { unoptimized: true },
};

export default nextConfig;
