import { existsSync } from "node:fs";
import path from "path";
import type { ResolvedConfig, PluginOption } from "vite";
import { decodeParamStr, mediaFitTag } from "./utils";
import fitFuncContext from "./context";
import { builtInFitKit } from "./fitKit";

// JPEG, PNG, WebP, GIF, AVIF, TIFF and SVG

// await sharp("text_rgba.png")
//   .trim({ background: "yellow", threshold: 42 })
//   .toFile("text_rgba1.png");
export interface IFitFuncParam {
  inputFilePath: string;
  params: { [key: string]: string };
  ctx: typeof fitFuncContext;
  outputFilePath: string;
}
export type FitFunc = (param: IFitFuncParam) => void;
export interface IOptions {
  fitKit?: { [key: string]: FitFunc };
  ffmpegPath?: string;
}

export default function mediaFit(opt?: IOptions): PluginOption {
  let root: string;
  let mode: string;

  const fitKit = Object.assign(builtInFitKit, opt?.fitKit || {});

  return {
    name: "mediaFit",
    enforce: "pre",
    configResolved(resolvedConfig: ResolvedConfig) {
      root = resolvedConfig.root;
      mode = resolvedConfig.mode;
      console.log(333, mode);
    },
    resolveId: {
      order: "post",
      handler(source, importer) {
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
    async load(id: string) {
      if (id.includes(mediaFitTag)) {
        // 1. 解码参数、目标文件地址、结果文件地址
        // 1.1 提取参数
        const fitFuncInfoArr = decodeParamStr(id);
        // 1.2  目标文件地址、结果文件地址（这里取简单做法）
        const inputFilePath = id.replace(/@fit:.*\./g, ".");
        const outputFilePath = id;

        // todo 检查是否存在inputFile

        // 验证是否已存在 outputFilePath ，有则跳过，没有继续
        if (!existsSync(outputFilePath)) {
          // 2. 匹配处理函数、依次运行转换函数，生成结果文件
          for (let index = 0; index < fitFuncInfoArr.length; index++) {
            const { fitFuncName, params } = fitFuncInfoArr[index];
            // fitFunc 参数
            // inputFilePath：需要被处理的文件路径
            // params：解析用户输入后的参数对象
            // ctx: { sharp; ffmpeg; info; error; warn }：上下文工具,
            // outputFilePath：需要输出的文件路径

            // fitFunc 一般包含以下逻辑
            // 1. 读取 inputFilePath 文件
            // 2. 处理
            // 3. 将处理结果写入 outputFilepath 中
            const fitFunc = fitKit[fitFuncName];
            await fitFunc({
              inputFilePath,
              outputFilePath,
              ctx: fitFuncContext,
              params: params,
            });
          }
        }
        // 已存在文件，跳过处理，直接返回
        // 4. 组装结果文件导出返回 (也可以 生成文件后不需要返回了)
        let code = `export default "${outputFilePath.replace(root, "")}"`;
        return code;
      }
    },
    transform() {},
  };
}
