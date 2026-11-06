import type { Plugin } from "vite";

const prefix = "\0wasm-module:";

export function wasmModule(): Plugin {
  return {
    name: "wasm-module",
    enforce: "pre",
    resolveId(source, importer) {
      if (!source.endsWith(".wasm?module") || !importer) return null;
      const file = new URL(source.slice(0, -"?module".length), `file://${importer}`).pathname;
      return prefix + file;
    },
    load(id) {
      if (!id.startsWith(prefix)) return null;
      const file = JSON.stringify(id.slice(prefix.length));
      return `import { readFileSync } from "node:fs";\nexport default new WebAssembly.Module(readFileSync(${file}));`;
    },
  };
}
