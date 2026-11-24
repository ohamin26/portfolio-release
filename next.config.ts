import type { NextConfig } from "next";

// A worktree can be nested inside another checkout with its own lockfile.
const config: NextConfig = {
  poweredByHeader: false,
  turbopack: { root: process.cwd() },
  outputFileTracingRoot: process.cwd(),
};

export default config;
