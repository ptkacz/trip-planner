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
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
