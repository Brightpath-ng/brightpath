import { describe, expect, it } from "vitest";
import { cn } from "../cn.js";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("drops falsy values", () => {
    expect(cn("px-2", false, undefined, null, "py-1")).toBe("px-2 py-1");
  });

  it("resolves conflicting tailwind classes in favor of the last one", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
