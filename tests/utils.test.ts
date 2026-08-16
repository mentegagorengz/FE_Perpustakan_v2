import { describe, expect, it } from "vitest";
import { cn, sanitizeRedirect } from "@/lib/utils";

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

describe("sanitizeRedirect", () => {
  it("mengembalikan path internal yang valid", () => {
    expect(sanitizeRedirect("/dashboard")).toBe("/dashboard");
    expect(sanitizeRedirect("/koleksi?page=2")).toBe("/koleksi?page=2");
  });

  it("menolak null, string kosong, dan undefined", () => {
    expect(sanitizeRedirect(null)).toBeNull();
    expect(sanitizeRedirect("")).toBeNull();
    expect(sanitizeRedirect(undefined)).toBeNull();
  });

  it("menolak URL eksternal dan protokol", () => {
    expect(sanitizeRedirect("https://evil.example")).toBeNull();
    expect(sanitizeRedirect("javascript:alert(1)")).toBeNull();
    expect(sanitizeRedirect("//evil.example")).toBeNull();
  });
});
