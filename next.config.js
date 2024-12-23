/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  basePath: process.env.BASE_PATH || '/tools',
}

module.exports = nextConfig
