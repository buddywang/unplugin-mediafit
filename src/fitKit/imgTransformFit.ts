import { rm } from "fs/promises";
import { FitFunc, IFitFuncParam } from "../index";
import {
  AvifOptions,
  GifOptions,
  JpegOptions,
  PngOptions,
  TiffOptions,
  WebpOptions,
} from "sharp";

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
 * 调整图片分辨率, 用法 itf(f=png&q=10)
 * @param data IFitFuncParam
 */
const imgTransformFit: FitFunc = async (data: IFitFuncParam) => {
  const { inputFilePath, outputFilePath, ctx, params } = data;
  const originFormat = inputFilePath.split(".").pop() || "";
  try {
    if (checkIfSupport(originFormat)) {
      const transformOpts: any = {};
      // format默认自己的格式
      let outputFormat: SupportFormat = originFormat as SupportFormat,
        paramMap: ParamMap;
      Object.keys(params).forEach((key) => {
        if (key == "f") {
          outputFormat = params[key] as SupportFormat;
          paramMap = formatOptsMap[outputFormat];
        }
      });
      Object.keys(params).forEach((key) => {
        if (key !== "f") {
          transformOpts[paramMap[key]] = params[key];
        }
      });

      ctx.info(`start to generate ${outputFilePath}`);
      await ctx
        .sharp(inputFilePath)
        .toFormat(outputFormat, transformOpts)
        .toFile(outputFilePath);
      ctx.info(`success generate ${outputFilePath}`);
    } else {
      ctx.error(`.${originFormat} not support`);
    }
  } catch (error) {
    // 删除文件
    rm(outputFilePath);
  }
};

export default imgTransformFit;
