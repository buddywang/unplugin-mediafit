import imageResizeFit from "./imageResizeFit";
import imgTransformFit from "./imgTransformFit";
import videoScaleFit from "./videoScaleFit";

export const builtInFitKit = {
  scale: videoScaleFit,
  rs: imageResizeFit,
  imgtf: imgTransformFit,
};
