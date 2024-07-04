import sharp from "sharp";
import ffmpeg from "./ffmpeg";
import logger from "./logger";
import path from "path";

export default Object.freeze({
  root: path.resolve(""),
  mode: process.env.NODE_ENV,
  sharp,
  ffmpeg,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
});
