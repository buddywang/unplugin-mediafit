import { existsSync } from "node:fs";
import path from "path";
import type { ResolvedConfig, PluginOption } from "vite";
import { decodeParamStr, mediaFitTag } from "./utils";
import fitFuncContext from "./context";
import { builtInFitKit } from "./fitKit";

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
        let inputFilePath = id.replace(/@fit:.*\./g, ".");
        // 那些需要转换格式的 fitfunc 会改变 outputFilePath
        let outputFilePath = id;

        // todo 检查是否存在inputFile

        // 2. 匹配处理函数、依次运行转换函数，生成结果文件
        for (let index = 0; index < fitFuncInfoArr.length; index++) {
          const { fitFuncName, params } = fitFuncInfoArr[index];
          // 碰到转换格式的，需要更新输出文件格式
          if (params.f) {
            const originFormat = inputFilePath.split(".").pop()!;
            outputFilePath = outputFilePath.replace(originFormat, params.f);
          }

          // todo 验证是否已存在 outputFilePath ，有则跳过，没有继续
          if (!existsSync(outputFilePath)) {
            const fitFunc = fitKit[fitFuncName];
            await fitFunc({
              inputFilePath,
              outputFilePath,
              ctx: fitFuncContext,
              params: params,
            });
          }

          // todo 暂不支持串联调用 fitfunc，暂时只考虑支持一个fitfunc函数调用
          inputFilePath = outputFilePath;
        }
        // 4. 组装结果文件导出返回
        // todo 不建议串联调用 fitfunc，暂时只支持一个fitfunc函数
        let code = `export default "${outputFilePath.replace(root, "")}"`;
        return code;
      }
    },
    transform() {},
  };
}
