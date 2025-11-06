import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  devServer: {
    allowedDevOrigins: [
      'https://6000-firebase-studio-1761988722069.cluster-edb2jv34dnhjisxuq5m7l37ccy.cloudworkstations.dev',
    ],
  },
};

export default nextConfig;
