import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  timeout: 90000,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://127.0.0.1:4321",
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: "npm run preview -- --host 127.0.0.1 --port 4321",
        url: "http://127.0.0.1:4321",
        reuseExistingServer: !process.env.CI,
      },
});
