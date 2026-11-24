import { defineConfig } from "@playwright/test";

const port = Number(process.env.PORTFOLIO_TEST_PORT ?? 4177);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORTFOLIO_TEST_PORT must be an integer between 1 and 65535.");
}
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  use: { baseURL },
  webServer: {
    command: `pnpm run start --hostname 127.0.0.1 --port ${port}`,
    url: `${baseURL}/health`,
    reuseExistingServer: false,
  },
});
