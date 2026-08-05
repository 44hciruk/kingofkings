import type { NextConfig } from "next";

const isXserverExport = process.env.XSERVER_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isXserverExport
    ? {
        output: "export",
        trailingSlash: true,
        // Xserver does not use the Cloudflare-only database modules.
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
