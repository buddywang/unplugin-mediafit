import { rm } from "fs/promises";
import { FitFunc, IFitFuncParam } from "../type";
import { ResizeOptions } from "sharp";

// 参数缩写哲学：取每个单词的第一个字母，例如 quality-> q ; tileWidth-> tw; xres-> xr ; bitdepth-> bd
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
