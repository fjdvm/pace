import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/instructor",
  workers: 1,
  use: { baseURL: "http://localhost:3126" },
  webServer: {
    command: "npx next dev -p 3126",
    url: "http://localhost:3126",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "http://localhost:55463",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "instructor-home-test-key",
    },
  },
});
