import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mediaFit from "unplugin-mediafit/vite";
// @ts-ignore
import mediaFitOrigin from "../../src/vite";
import Inspect from "vite-plugin-inspect";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  let pluginFunc = mediaFit;
  if (mode == "debug") {
    pluginFunc = mediaFitOrigin;
  }

  return {
    plugins: [
      vue(),
      pluginFunc({
        ffmpegPath: "/your/path/to/ffmpeg", // todo replace to your ffmpeg path
      }),
      Inspect(),
    ],
    // build: { minify: false },
  };
});
