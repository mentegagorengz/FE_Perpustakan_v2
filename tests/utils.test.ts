import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("menggabungkan class sederhana", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("mengabaikan nilai falsy", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("menggabungkan objek kondisi", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("menyelesaikan konflik tailwind (merge)", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });

  it("mendukung array bersarang", () => {
    expect(cn(["a", ["b", { c: true }]])).toBe("a b c");
  });
});
