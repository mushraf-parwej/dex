/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['coin-images.coingecko.com']
  }
};

export default nextConfig;
