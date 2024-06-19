import { existsSync } from "node:fs";
import path from "path";
import { writeFile } from "node:fs/promises";
import sharp from "sharp";
import type { ResolvedConfig, PluginOption } from "vite";
import { decodeParamStr, mediaFitTag } from "./utils";
import fitFuncContext from "./context";
import logger from "./logger";

// WebAssembly.instantiate
// JPEG, PNG, WebP, GIF, AVIF, TIFF and SVG

// await sharp("text_rgba.png")
//   .trim({ background: "yellow", threshold: 42 })
//   .toFile("text_rgba1.png");

export default function mediaFit(opt: {
  fitKit?: { [key: string]: () => any };
  ffmpegPath?: string;
}): PluginOption {
  let root: string;
  let mode: string;
  let pluginContext: any;

  const fitKit = opt.fitKit;

  return {
    name: "mediaFit",
    enforce: "pre",
    configResolved(resolvedConfig: ResolvedConfig) {
      root = resolvedConfig.root;
      mode = resolvedConfig.mode;
    },
    resolveId: {
      order: "post",
      handler(source, importer) {
        pluginContext = this;
        if (source.includes(mediaFitTag)) {
          // resolve
          let absolutePath;
          // source will resolve by import-analysis plugin when config alias, if so, just use the result
          if (source.includes(root)) {
            absolutePath = source;
          } else {
            absolutePath = path.join(path.dirname(importer || ""), source);
          }

          return absolutePath;
        }
      },
    },
    load(id: string) {
      if (id.includes(mediaFitTag)) {
        // 1. 解码参数、目标文件地址、结果文件地址
        // 1.1 提取参数
        const fitFuncCtxArr = decodeParamStr(id);
        // console.log(111, fitFuncCtxArr);
        // 1.2  目标文件地址、结果文件地址（这里取简单做法）
        // const filePath =
        // const startIndex = id.indexOf(mediaFitTag);
        // const endIndex = id.lastIndexOf(".");
        const inputFilePath = id.replace(/@fit:.*\./g, ".");
        const outputFilePath = id;
        // 验证是否已有结果文件，有则跳过，没有继续
        if (!existsSync(outputFilePath)) {
          // 2. 匹配处理函数
          // 生成函数参数
          const ctx = fitFuncContext;
          console.log(333, inputFilePath);
          ctx.ffmpeg.run(
            `-i ${inputFilePath} -vf scale=200:-1 ${outputFilePath}`
          );

          // 3. 依次运行转换函数，生成结果文件（运行前验证是否已有结果文件）
        }
        // 已存在文件，跳过处理，直接返回
        // 4. 组装结果文件导出返回 todo 生成文件后不需要返回了
        let code = `export default "${outputFilePath.replace(root, "")}"`;
        return code;
      }
    },
    transform() {},
  };
}
