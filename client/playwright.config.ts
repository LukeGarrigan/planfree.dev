import { defineConfig, devices } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// The e2e suite drives the *real* app: the Socket.IO server (3000) and the Vite
// dev server (8080). Playwright boots both via `webServer` below, reusing them
// if you already have them running (`npm start` / `npm run dev`).
//
// Handy knobs (env vars):
//   PLAYERS=30   how many people to simulate in the crowd test
//   HOLD_MS=8000 in --headed mode, how long to linger on the final board so you
//                can actually watch it
//   SLOW_MO=150  slow every action down by N ms (great with --headed)
export default defineConfig({
  testDir: "./e2e",
  // A crowded room with many browser contexts takes a while to wire up.
  timeout: 120_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:8080",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: {
      slowMo: Number(process.env.SLOW_MO) || 0,
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "node index.js",
      cwd: resolve(__dirname, "../server"),
      port: 3000,
      reuseExistingServer: !process.env.CI,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command: "npm run dev",
      cwd: __dirname,
      url: "http://localhost:8080",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
