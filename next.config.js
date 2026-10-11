const nextConfig = {
  distDir: process.env.MILI_QA === '1' ? '.next-qa' : '.next',
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  experimental: {
    swcPlugins: [],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn, remove log, info, debug, etc.
    } : false,
  },
  // Nginx sends /api/* to Laravel, so Next's reel streaming API must be
  // reachable via a public path that falls through to the Next.js server.
  async rewrites() {
    return [
      { source: '/reels-stream', destination: '/api/reels/stream' },
    ];
  },
  // Disable the server-side image optimizer until a verified remote host
  // allowlist is available. This prevents arbitrary image URL fetches,
  // including attempts to access link-local cloud metadata endpoints.
  // Remote image URLs continue to render directly in the browser.
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;



// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   images: {
//     domains: [
//       "bjorn66.com",
//       "6ammart-test.6amdev.xyz",
//       "192.168.50.168",
//       "6ammart-dev.6amdev.xyz",
//     ], // Add the domain here
//   },
// };
//
// module.exports = nextConfig;
