import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { ADMIN_ROUTES, AUTH_COOKIE } from "@/lib/constants";

describe("proxy route protection", () => {
  it("redirect ke /login?redirect= saat akses route admin tanpa cookie", () => {
    const request = new NextRequest("http://localhost:3001/dashboard");
    const response = proxy(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toContain("/login?redirect=%2Fdashboard");
  });

  it("mengizinkan route admin dengan cookie auth", () => {
    const request = new NextRequest("http://localhost:3001/roles", {
      headers: { cookie: `${AUTH_COOKIE}=dummy-1` },
    });
    const response = proxy(request);

    expect(response.status).toBe(200);
  });

  it("tidak mengganggu route publik", () => {
    const request = new NextRequest("http://localhost:3001/koleksi");
    const response = proxy(request);

    expect(response.status).toBe(200);
  });

  it("mengirim redirect ke halaman yang diminta sebagai parameter", () => {
    const request = new NextRequest("http://localhost:3001/policy");
    const response = proxy(request);
    const location = response.headers.get("location") ?? "";

    expect(location).toContain("/login?redirect=");
    expect(decodeURIComponent(location)).toContain("/policy");
  });
});

describe("ADMIN_ROUTES", () => {
  it("mencakup seluruh route admin aplikasi", () => {
    for (const route of ["/dashboard", "/articles", "/tracking", "/roles", "/policy", "/logs"]) {
      expect(ADMIN_ROUTES.some((path) => route.startsWith(path))).toBe(true);
    }
  });

  it("tidak menangkap route publik", () => {
    for (const route of ["/", "/koleksi", "/artikel", "/profil", "/login"]) {
      expect(ADMIN_ROUTES.some((path) => route.startsWith(path))).toBe(false);
    }
  });
});
