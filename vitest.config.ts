import { defineConfig } from "vitest/config"
import path from "node:path"

/**
 * We only run unit tests on pure helpers — data normalization, FX/peg math,
 * NGN-turnover, and a smoke test that the snapshot schema rejects junk.
 * The dashboard itself is verified visually in CI deploy previews.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    reporters: "default",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
