import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Blog cover images are arbitrary URLs pasted in the admin (no fixed CDN),
    // so allow any HTTPS host instead of maintaining a per-host allowlist.
    // The optimizer only optimizes — it never forwards auth headers. Narrow
    // this back to specific hostnames if cover sources ever become fixed.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
