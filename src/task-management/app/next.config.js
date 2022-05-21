/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/task-tracker',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [{
      source: "/api/auth/:path*",
      has: [
        { type: 'header', key: 'Origin', value: '(?<origin>.*)' },
      ],
      headers: [
        { key: 'Access-Control-Allow-Credentials', value: 'true' },
        { key: 'Access-Control-Allow-Origin', value: ':origin' },
        { key: 'Access-Control-Allow-Methods', value: 'GET, OPTIONS, PATCH, DELETE, POST, PUT' },
        { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
      ],
    }];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });

    return config;
  }
}

module.exports = nextConfig
