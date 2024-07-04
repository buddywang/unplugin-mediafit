import sharp from "sharp";

export interface IFitFuncParam {
  /**
   * 输入文件路径
   */
  inputFilePath: string;
  /**
   * 解析的参数对象，如 ...@fit:rs(w=11&h=22).. 得到{w: "11", h: "22"}
   */
  params: { [key: string]: string };
  /**
   * fitFunc函数上下文，提供sharp、ffmpeg、logger等工具
   */
  ctx: Readonly<{
    /**
     * 项目根路径
     */
    root: string;
    /**
     * process.env.NODE_ENV，development or production
     */
    mode: string | undefined;
    /**
     * https://sharp.pixelplumbing.com/
     */
    sharp: typeof sharp;
    /**
     * 简单封装了ffmpeg，可以像命令行一样调用ffmpeg
     */
    ffmpeg: Readonly<{
      run: (argsStr: string) => Promise<string>;
    }>;
    info: (str: string) => void;
    warn: (str: string) => void;
    error: (str: string) => never;
  }>;
  /**
   * 输出文件路径
   */
  outputFilePath: string;
}

export type FitFunc = (param: IFitFuncParam) => void;

export interface IOptions {
  /**
   * 自定义fitFunc集合，key为使用时的缩写
   */
  fitKit?: { [key: string]: FitFunc };
  /**
   * 如需要使用ctx.ffmpeg, 请配置ffmpeg命令行工具路径，如果ffmpeg命令全局可用，传'ffmpeg'即可
   */
  ffmpegPath?: string;
}
