import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // @react-pdf/renderer uses canvas and other Node-only modules
  // Exclude it from the browser bundle
  serverExternalPackages: ['@react-pdf/renderer'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle server-only PDF modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

export default nextConfig
