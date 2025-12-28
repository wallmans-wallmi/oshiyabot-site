/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Support for Hebrew/RTL if needed
  i18n: undefined, // We'll handle RTL in CSS
};

export default nextConfig;
