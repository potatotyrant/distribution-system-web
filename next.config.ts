import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },

  async redirects() {
    return [
      {
        source: "/",
        destination: "/contract/dsp/list",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/contract/dsp/list",
        permanent: true,
      },
    ];
  },

  compiler: {
    styledComponents: true,
  },

  images: {
    domains: [
      "storage-test-distribution.sovo360.com",
      "storage-distribution.sovo360.com",
    ],
  },
};

export default nextConfig;
