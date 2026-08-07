import { describe, expect, it } from "vitest";
import { loginSchema, policySchema, articleSchema } from "@/lib/schemas";

describe("loginSchema", () => {
  it("menerima email dan password yang valid", () => {
    const result = loginSchema.safeParse({ email: "admin@unsrat.ac.id", password: "rahasia123" });
    expect(result.success).toBe(true);
  });

  it("menolak email kosong", () => {
    const result = loginSchema.safeParse({ email: "", password: "x" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toBe("Email wajib diisi.");
  });

  it("menolak email tidak valid", () => {
    const result = loginSchema.safeParse({ email: "bukan-email", password: "x" });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].message).toContain("tidak valid");
  });

  it("menolak password kosong", () => {
    const result = loginSchema.safeParse({ email: "a@b.com", password: "" });
    expect(result.success).toBe(false);
  });
});

describe("policySchema", () => {
  it("menerima nilai angka valid", () => {
    const result = policySchema.safeParse({ fine_per_day: "1000", loan_duration_days: "14", max_books_per_user: "3" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ fine_per_day: 1000, loan_duration_days: 14, max_books_per_user: 3 });
    }
  });

  it("menolak denda negatif", () => {
    const result = policySchema.safeParse({ fine_per_day: "-5", loan_duration_days: "14", max_books_per_user: "3" });
    expect(result.success).toBe(false);
  });

  it("menolak durasi nol", () => {
    const result = policySchema.safeParse({ fine_per_day: "0", loan_duration_days: "0", max_books_per_user: "3" });
    expect(result.success).toBe(false);
  });

  it("menolak nilai pecahan", () => {
    const result = policySchema.safeParse({ fine_per_day: "100.5", loan_duration_days: "14", max_books_per_user: "3" });
    expect(result.success).toBe(false);
  });
});

describe("articleSchema", () => {
  it("menerima artikel valid", () => {
    const result = articleSchema.safeParse({ title: "Judul", content: "Konten", is_published: true });
    expect(result.success).toBe(true);
  });

  it("menolak judul kosong dan terlalu panjang", () => {
    expect(articleSchema.safeParse({ title: "", content: "c", is_published: false }).success).toBe(false);
    expect(articleSchema.safeParse({ title: "x".repeat(201), content: "c", is_published: false }).success).toBe(false);
  });
});
