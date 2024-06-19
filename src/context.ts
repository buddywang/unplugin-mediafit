import sharp from "sharp";
import ffmpeg from "./ffmpeg";
import logger from "./logger";

export default Object.freeze({
  sharp,
  ffmpeg,
  info: logger.info,
  warn: logger.warn,
  error: logger.error,
});
