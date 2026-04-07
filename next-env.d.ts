/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ini penting agar build tidak error karena missing env
  env: {
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || 'dummy-key-for-build',
  },
}

module.exports = nextConfig
