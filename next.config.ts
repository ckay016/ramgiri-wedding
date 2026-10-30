import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The bundled artwork is SVG. Swap in PNG/WebP paintings any time; they'll be optimised as usual.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
