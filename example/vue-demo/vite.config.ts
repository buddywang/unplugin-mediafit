import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mediaFit from "unplugin-mediafit";
// @ts-ignore
import mediaFitOrigin from "../../src/index";
import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let pluginFunc = mediaFit;
  if (mode == "debug") {
    pluginFunc = mediaFitOrigin;
  }

  return {
    plugins: [vue(), pluginFunc(), Inspect()],
    // build: { minify: false },
  };
});
