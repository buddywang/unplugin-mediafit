import { describe, expect, it } from "vitest";
import { decodeParamStr } from "../src/core/utils";

describe("utils", () => {
  it("decodeParamStr", () => {
    const res = decodeParamStr("xx/xx/aa@fit:rs(w=200&h=300&f=cover).png");
    expect(res).toEqual([
      { fitFuncName: "rs", params: { w: "200", h: "300", f: "cover" } },
    ]);
  });
});
