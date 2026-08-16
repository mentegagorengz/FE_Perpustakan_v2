import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";
import { ADMIN_ROUTES } from "@/lib/constants";

describe("proxy pass-through", () => {
  it("mengizinkan route admin (auth guard di-handle client-side oleh AdminLayout)", () => {
    const request = new NextRequest("http://localhost:3001/dashboard");
    const response = proxy(request);

    expect(response.status).toBe(200);
  });

  it("tidak mengganggu route publik", () => {
    const request = new NextRequest("http://localhost:3001/koleksi");
    const response = proxy(request);

    expect(response.status).toBe(200);
  });
});

describe("ADMIN_ROUTES", () => {
  it("mencakup seluruh route admin aplikasi", () => {
    for (const route of ["/dashboard", "/articles", "/tracking", "/roles", "/policy", "/logs"]) {
      expect(ADMIN_ROUTES.some((path) => route.startsWith(path))).toBe(true);
    }
  });

  it("tidak menangkap route publik dan halaman login", () => {
    for (const route of ["/", "/koleksi", "/artikel", "/profil", "/login", "/admin", "/admin/login"]) {
      expect(ADMIN_ROUTES.some((path) => route.startsWith(path))).toBe(false);
    }
  });
});

