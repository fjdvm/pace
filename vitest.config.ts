import { defineConfig } from "vitest/config";
import path from "path";
import { wasmModule } from "./vitest.wasm-module";

export default defineConfig({
  plugins: [wasmModule()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", ".open-next", ".wrangler"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
