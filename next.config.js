/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["jgnfhnospuxvkkfieoyx.supabase.co"],
  },
  swcMinify: true,
};

module.exports = nextConfig;
