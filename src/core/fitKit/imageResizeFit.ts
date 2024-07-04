import { rm } from "fs/promises";
import { FitFunc, IFitFuncParam } from "../unplugin";
import { ResizeOptions } from "sharp";

// fitFunc 参数
// inputFilePath：需要被处理的文件路径
// params：解析用户输入后的参数对象
// ctx: { sharp; ffmpeg; info; error; warn }：上下文工具,
// outputFilePath：需要输出的文件路径

// fitFunc 一般包含以下逻辑
// 1. 读取 inputFilePath 文件
// 2. 处理
// 3. 将处理结果写入 outputFilepath 中
const paramMap: { [key: string]: keyof ResizeOptions } = {
  w: "width",
  h: "height",
  f: "fit", //cover/contain/fill/inside/outside
  p: "position",
  b: "background",
  k: "kernel",
  we: "withoutEnlargement",
  wr: "withoutReduction",
  fsol: "fastShrinkOnLoad",
};

/**
 * 调整图片尺寸, 用法 rs(w=xx&h=xx&f=cover...)
 * @param data IFitFuncParam
 */
const imageResizeFit: FitFunc = async (data: IFitFuncParam) => {
  const { inputFilePath, outputFilePath, ctx, params } = data;
  try {
    // 1. 解析
    const resizeOpts: any = {};
    Object.keys(params).forEach((key) => {
      resizeOpts[paramMap[key]] = params[key];
    });

    // 2. 调用sharp
    await ctx.sharp(inputFilePath).resize(resizeOpts).toFile(outputFilePath);
  } catch (error) {
    // 删除文件
    rm(outputFilePath);
  }
};

export default imageResizeFit;
