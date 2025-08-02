// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',
//   // Disable image optimization since it requires a server
//   images: {
//     unoptimized: true,
//   },
//   // Ensure trailing slashes for better static hosting compatibility
//   trailingSlash: true,
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// }

// export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🛠️ Fix PDF.js error by disabling Node-only fallbacks
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      canvas: false,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;
