import colors from "picocolors";
import { getTimeFormatter } from "./utils";

const logTag = "[vite-plugin-mediafit]";

const logger = {
  info(str: string) {
    console.log(
      `${colors.dim(getTimeFormatter().format(new Date()))} ${colors.bgBlue(
        logTag
      )} ${colors.blue(str)}`
    );
  },
  warn(str: string) {
    console.warn(
      `${colors.dim(getTimeFormatter().format(new Date()))} ${colors.bgYellow(
        logTag
      )} ${colors.yellow(str)}`
    );
  },
  error(str: string) {
    console.error(
      `${colors.dim(getTimeFormatter().format(new Date()))} ${colors.bgRed(
        logTag
      )} ${colors.red(str)}`
    );

    console.error(
      `${colors.red("Stopped unexpectedly, please check the logs")}`
    );
    process.exit(1);
  },
};

export default logger;
