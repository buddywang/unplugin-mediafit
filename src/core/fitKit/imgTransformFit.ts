import { rm } from "fs/promises";
import { FitFunc, IFitFuncParam } from "../type";
import {
  AvifOptions,
  GifOptions,
  JpegOptions,
  PngOptions,
  TiffOptions,
  WebpOptions,
} from "sharp";

// todo 参数如何区分数字、字符串、boolean
// 参数缩写哲学：取每个单词的第一个字母，例如 quality-> q ; tileWidth-> tw; xres-> xr ; bitdepth-> bd
const jpegParamMap: { [key: string]: keyof JpegOptions } = {
  q: "quality",
  p: "progressive",
  cs: "chromaSubsampling",
  oc: "optimiseCoding",
  mj: "mozjpeg",
  tq: "trellisQuantisation",
  od: "overshootDeringing",
  os: "optimiseScans",
  qt: "quantisationTable",
  fc: "force",
};
const pngParamMap: { [key: string]: keyof PngOptions } = {
  p: "progressive",
  cl: "compressionLevel",
  af: "adaptiveFiltering",
  pa: "palette",
  q: "quality",
  e: "effort",
  c: "colours",
  d: "dither",
  fc: "force",
};
const webpParamMap: { [key: string]: keyof WebpOptions } = {
  q: "quality",
  aa: "alphaQuality",
  ll: "lossless",
  nl: "nearLossless",
  ss: "smartSubsample",
  p: "preset",
  e: "effort",
  l: "loop",
  d: "delay",
  ms: "minSize",
  m: "mixed",
  fc: "force",
};
const gifParamMap: { [key: string]: keyof GifOptions } = {
  r: "reuse",
  p: "progressive",
  c: "colours",
  e: "effort",
  di: "dither",
  ifme: "interFrameMaxError",
  ipme: "interPaletteMaxError",
  l: "loop",
  d: "delay",
  fc: "force",
};
const avifParamMap: { [key: string]: keyof AvifOptions } = {
  q: "quality",
  l: "lossless",
  e: "effort",
  cs: "chromaSubsampling",
  b: "bitdepth",
};
const tiffParamMap: { [key: string]: keyof TiffOptions } = {
  q: "quality",
  fc: "force",
  c: "compression",
  p: "predictor",
  py: "pyramid",
  t: "tile",
  tw: "tileWidth",
  th: "tileHeight",
  xr: "xres",
  yr: "yres",
  ru: "resolutionUnit",
  bd: "bitdepth",
  mw: "miniswhite",
};
type ParamMap =
  | typeof jpegParamMap
  | typeof pngParamMap
  | typeof webpParamMap
  | typeof gifParamMap
  | typeof avifParamMap
  | typeof tiffParamMap;
const formatOptsMap = {
  jpg: jpegParamMap,
  jpeg: jpegParamMap,
  png: pngParamMap,
  webp: webpParamMap,
  gif: gifParamMap,
  avif: avifParamMap,
  tiff: tiffParamMap,
  tif: tiffParamMap,
};
type SupportFormat = keyof typeof formatOptsMap;

const checkIfSupport = (format: string) => {
  // @ts-ignore
  return !!formatOptsMap[format];
};

/**
 * 转换图片，可转换格式，指定转换质量等等, 用法 imgtf(f=png&q=80)
 * https://sharp.pixelplumbing.com/api-output#toformat
 * @param data IFitFuncParam
 */
const imgTransformFit: FitFunc = async (data: IFitFuncParam) => {
  const { inputFilePath, outputFilePath, ctx, params } = data;
  const originFormat = inputFilePath.split(".").pop() || "";
  try {
    if (checkIfSupport(originFormat)) {
      const transformOpts: any = {};
      // format默认自己的格式
      let outputFormat: SupportFormat = originFormat as SupportFormat;
      let paramMap: ParamMap;
      Object.keys(params).forEach((key) => {
        // 需要转换格式时，规定需要转换格式时，用 f 缩写
        if (key == "f") {
          outputFormat = params[key] as SupportFormat;
        }
      });
      // 参数缩写map
      paramMap = formatOptsMap[outputFormat];

      // 解析参数
      Object.keys(params).forEach((key) => {
        if (key !== "f") {
          transformOpts[paramMap[key]] = params[key];
        }
      });

      ctx.info(`start to generate ${outputFilePath.replace(ctx.root, "")}`);

      await ctx
        .sharp(inputFilePath)
        .toFormat(outputFormat, transformOpts)
        .toFile(outputFilePath);

      ctx.info(`success generate ${outputFilePath.replace(ctx.root, "")}`);
    } else {
      ctx.error(
        `.${originFormat} not support when processing ${inputFilePath.replace(
          ctx.root,
          ""
        )}`
      );
    }
  } catch (error) {
    // 删除文件
    rm(outputFilePath);
  }
};

export default imgTransformFit;
