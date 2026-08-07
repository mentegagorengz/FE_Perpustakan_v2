import { describe, expect, it } from "vitest";
import { formatDate, formatLongDate, formatDateTime, formatRupiah } from "@/lib/format";

describe("formatDate", () => {
  it("mengembalikan tanda hubung untuk nilai kosong", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
    expect(formatDate("")).toBe("-");
  });

  it("mengembalikan tanda hubung untuk tanggal invalid", () => {
    expect(formatDate("bukan-tanggal")).toBe("-");
  });

  it("memformat tanggal ISO ke format id-ID", () => {
    expect(formatDate("2024-03-10")).toBe("10/3/2024");
  });
});

describe("formatLongDate", () => {
  it("memformat tanggal panjang dalam bahasa Indonesia", () => {
    expect(formatLongDate("2024-03-10")).toMatch(/10 Maret 2024/);
  });
});

describe("formatDateTime", () => {
  it("memformat tanggal dan waktu 24 jam", () => {
    const result = formatDateTime("2024-03-10T08:30:00");
    expect(result).toContain("08.30");
    expect(result).toContain("2024");
  });

  it("mengembalikan tanda hubung untuk nilai kosong atau invalid", () => {
    expect(formatDateTime(null)).toBe("-");
    expect(formatDateTime("bukan-tanggal")).toBe("-");
  });
});

describe("formatRupiah", () => {
  it("memformat angka menjadi rupiah tanpa desimal", () => {
    expect(formatRupiah(1000)).toBe("Rp 1.000");
    expect(formatRupiah(185000)).toBe("Rp 185.000");
  });

  it("memformat nol", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
  });
});
