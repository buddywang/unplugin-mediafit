import { spawn } from "child_process";
// import path from "path";
import logger from "./logger";

let ffmpegPath = "";
const run = (argsStr: string): Promise<string> => {
  // 验证是否有可用的ffmpeg
  if (!ffmpegPath) {
    logger.error("Missing ffmpegPath, see options.ffmpegPath");
  }

  return new Promise((resolve, reject) => {
    const commandStr = `${ffmpegPath} ${argsStr}`;
    const [command, ...args] = commandStr.split(" ");

    logger.info(`start running '${commandStr}'`);

    // 使用spawn方法执行命令
    const ffmpegProcess = spawn(command, args);

    // 监听stdout输出
    ffmpegProcess.stdout.on("data", (data) => {
      logger.info(`${data.toString()}`);
    });

    // 监听stderr输出，这通常包含警告和错误信息
    ffmpegProcess.stderr.on("data", (data) => {
      logger.info(`${data.toString()}`);
    });

    // 监听进程关闭事件
    ffmpegProcess.on("close", (code) => {
      if (code === 0) {
        logger.info("FFmpeg processing finished successfully.");
        // todo 生成后 通过hmr更新文件
        resolve("success");
      } else {
        reject("fail");
        logger.error(`FFmpeg exited with code ${code}.`);
      }
    });

    // 可选：监听进程错误事件
    ffmpegProcess.on("error", (err) => {
      reject("fail");
      logger.error(`Error spawning FFmpeg: ${err}`);
    });
  });
};

export const setFFmpegPath = (ffmpegpath: string) => {
  ffmpegPath = ffmpegpath;
};
export default Object.freeze({
  run: run,
});
