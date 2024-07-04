import { rm } from "fs/promises";
import { FitFunc, IFitFuncParam } from "../type";

// fitFunc 参数
// inputFilePath：需要被处理的文件路径
// params：解析用户输入后的参数对象
// ctx: { sharp; ffmpeg; info; error; warn }：上下文工具,
// outputFilePath：需要输出的文件路径

// fitFunc 一般包含以下逻辑
// 1. 读取 inputFilePath 文件
// 2. 处理
// 3. 将处理结果写入 outputFilepath 中

/**
 * 调整视频分辨率，用法 scale(w=xx&h=xx)
 * @param data IFitFuncParam
 */
const videoScaleFit: FitFunc = async (data: IFitFuncParam) => {
  const { inputFilePath, outputFilePath, ctx, params } = data;
  try {
    const { w = -1, h = -1 } = params;
    const argsStr = `-i ${inputFilePath} -vf scale=${w}:${h} ${outputFilePath}`;
    await ctx.ffmpeg.run(argsStr);
  } catch (error) {
    // 删除文件
    rm(outputFilePath);
  }
};

export default videoScaleFit;
