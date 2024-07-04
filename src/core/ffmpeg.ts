import { spawn } from "child_process";
import path from "path";
import logger from "./logger";

const getDefaultFFmpegPath = () => {
  const os = process.platform;
  if (os === "win32") {
    // todo: Generate ffmpeg exe file under window platform
    logger.warn("暂不支持window平台");
  } else if (os === "darwin") {
    // logger.info("当前运行在macOS系统上");
    return path.join(__dirname, "./bin/ffmpeg");
  } else if (os === "linux") {
    logger.warn("暂不支持linux平台");
  } else {
    logger.warn("暂不支持本平台");
  }
  return "";
};

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
        logger.error(`FFmpeg exited with code ${code}.`);
        reject("fail");
      }
    });

    // 可选：监听进程错误事件
    ffmpegProcess.on("error", (err) => {
      logger.error(`Error spawning FFmpeg: ${err}`);
      // todo  删除生成文件
      reject("fail");
    });
  });
};

export default Object.freeze({
  setFFmpegPath: (ffmpegpath: string) => {
    ffmpegPath = ffmpegpath || getDefaultFFmpegPath();
  },
  run: run,
});
