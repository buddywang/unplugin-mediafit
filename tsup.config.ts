import { defineConfig } from "tsup";

export default defineConfig(() => ({
  entry: ["src/*.ts"],
  splitting: false,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  shims: true,
}));
