export const mediaFitTag = "@fit:";

interface IFitFuncInfo {
  fitFuncName: string;
  params: { [key: string]: string };
}
/**
 * 对于输入形如 'xx/xx/aa@fit:rs(w=200&h=300&f=cover).png'的字符串，返回 [{fitFuncName: "rs", params: {w:'200',h:'300',f:'cover'}}]
 * @param id 包含 mediafit 调用格式字符串
 * @returns 解码后的信息数组
 */
export const decodeParamStr = (id: string): IFitFuncInfo[] => {
  const startIndex = id.indexOf(mediaFitTag) + mediaFitTag.length;
  const endIndex = id.lastIndexOf(".");
  const paramsStr = id.slice(startIndex, endIndex);
  const paramsArr = paramsStr.split(",");
  const fitFuncCtxArr: any[] = [];
  paramsArr.forEach((item) => {
    // 解析fitFunName 和 参数
    const fitFuncCtx: any = { fitFuncName: "", params: {} };
    // 正则匹配获取捕获组
    const temp = [...item.matchAll(/(.*)\((.*)\)/g)];
    const [_, fitFuncName, paramsStr] = temp[0];
    fitFuncCtx.fitFuncName = fitFuncName;
    const arr = paramsStr.split("&");
    arr.forEach((query) => {
      const [key, value] = query.split("=");
      fitFuncCtx.params[key] = value;
    });
    fitFuncCtxArr.push(fitFuncCtx);
  });
  return fitFuncCtxArr;
};

// Only initialize the timeFormatter when the timestamp option is used, and
// reuse it across all loggers
let timeFormatter: Intl.DateTimeFormat;
export function getTimeFormatter() {
  timeFormatter ??= new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  return timeFormatter;
}
