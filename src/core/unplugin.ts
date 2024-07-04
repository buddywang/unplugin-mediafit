import { existsSync, readFileSync } from "node:fs";
import path from "path";
import { decodeParamStr, mediaFitTag } from "./utils";
import fitFuncContext from "./context";
import { builtInFitKit } from "./fitKit";
import logger from "./logger";
import { createUnplugin } from "unplugin";
import { IOptions } from "./type";
import { setFFmpegPath } from "./ffmpeg";

// @ts-ignore
export default createUnplugin<IOptions | undefined>((opt) => {
  const { root, mode } = fitFuncContext;

  const fitKit = Object.assign(builtInFitKit, opt?.fitKit || {});
  // 初始化ffmpegPath
  setFFmpegPath(opt?.ffmpegPath || "");

  return {
    name: "unplugin-mediaFit",
    enforce: "pre", // 在 vite 核心插件 vite:asset 前运行，避免路径被vite:asset插件处理了
    resolveId: {
      // order: "post", // todo why
      handler(source: string, importer: string) {
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

        return null;
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

        // 检查是否存在inputFile
        if (!existsSync(inputFilePath)) {
          logger.error(
            `${inputFilePath.replace(root, "")}
             not exist when processing ${outputFilePath.replace(root, "")}`
          );
        }

        // 2. 匹配处理函数、运行转换函数，生成结果文件
        // 暂不支持串联调用 fitfunc，暂时只考虑支持一个fitfunc函数调用
        for (let index = 0; index < fitFuncInfoArr.length; index++) {
          const { fitFuncName, params } = fitFuncInfoArr[index];
          // 碰到转换格式的，需要更新输出文件格式
          if (params.f) {
            const originFormat = inputFilePath.split(".").pop()!;
            outputFilePath = outputFilePath.replace(originFormat, params.f);
          }

          // 验证是否已存在 outputFilePath ，有则跳过，没有继续
          if (!existsSync(outputFilePath)) {
            const fitFunc = fitKit[fitFuncName];
            await Promise.resolve(
              fitFunc({
                inputFilePath,
                outputFilePath,
                ctx: fitFuncContext,
                params: params,
              })
            );
          }

          inputFilePath = outputFilePath;
        }

        // 3. 返回文件路径导出语句
        if (mode == "development") {
          let code = `export default "${outputFilePath.replace(root, "")}";`;
          return code;
        } else {
          // 将生成的文件添加到构建产物中
          const referenceId = this.emitFile({
            type: "asset",
            name: path.basename(outputFilePath),
            needsCodeReference: true,
            source: readFileSync(outputFilePath),
          });

          let code = `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
          return code;
        }
      }
      return null;
    },
  };
});
