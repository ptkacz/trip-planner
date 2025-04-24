import { defineConfig } from "vitest/config";
import react from "@astrojs/react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    setupFiles: ["./src/tests/setup.ts"],
    environmentMatchGlobs: [
      // Używaj happy-dom dla testów komponentów React
      ["src/tests/unit/*.{tsx,jsx}", "happy-dom"],
    ],
    env: {
      // Zmienne środowiskowe dla testów
      SUPABASE_URL: "https://test-url.supabase.co",
      SUPABASE_KEY: "test-key",
      OPENROUTER_API_KEY: "test-openrouter-key",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
