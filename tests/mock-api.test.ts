import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { handleMockRequest, MockHttpError } from "@/lib/mock-api";
import { AUTH_COOKIE } from "@/lib/constants";

describe("mock-api auth flow", () => {
  beforeEach(() => {
    document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0`;
  });

  afterAll(() => new Promise((resolve) => setTimeout(resolve, 200)));

  it("login berhasil menyimpan cookie auth", async () => {
    const session = await handleMockRequest("POST", "/auth/login", new URLSearchParams(), {
      email: "admin@unsrat.ac.id",
      password: "password123",
    });

    expect(session).toMatchObject({ user: { email: "admin@unsrat.ac.id", role: "SUPER_ADMIN" } });
    expect(document.cookie).toContain(AUTH_COOKIE);
  });

  it("login gagal untuk akun tidak dikenal", async () => {
    await expect(
      handleMockRequest("POST", "/auth/login", new URLSearchParams(), { email: "tidak@ada.com", password: "x" }),
    ).rejects.toMatchObject({ status: 400 });
  });

  it("me lempar 401 saat aksi butuh sesi tanpa cookie", async () => {
    const error = await handleMockRequest("POST", "/articles", new URLSearchParams(), {
      title: "t",
      content: "c",
      is_published: false,
    }).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(MockHttpError);
    expect(error).toMatchObject({ status: 401 });
  });

  it("me kembalikan user saat cookie valid", async () => {
    await handleMockRequest("POST", "/auth/login", new URLSearchParams(), { email: "staff@unsrat.ac.id", password: "x" });

    const session = await handleMockRequest("GET", "/auth/me", new URLSearchParams(), undefined);
    expect(session).toMatchObject({ user: { email: "staff@unsrat.ac.id", role: "STAFF" } });
  });

  it("logout menghapus cookie dan me menjadi null", async () => {
    await handleMockRequest("POST", "/auth/login", new URLSearchParams(), { email: "mahasiswa@unsrat.ac.id", password: "x" });
    await handleMockRequest("POST", "/auth/logout", new URLSearchParams(), undefined);

    expect(document.cookie).not.toContain(AUTH_COOKIE);
    const session = await handleMockRequest("GET", "/auth/me", new URLSearchParams(), undefined);
    expect(session).toEqual({ user: null });
  });

  it("artikel publik hanya menampilkan yang published tanpa sesi", async () => {
    const articles = await handleMockRequest("GET", "/articles", new URLSearchParams(), undefined);
    const list = articles as Array<{ is_published: boolean }>;
    expect(list.every((article) => article.is_published)).toBe(true);
  });

  it("artikel admin menampilkan semua saat sesi aktif", async () => {
    await handleMockRequest("POST", "/auth/login", new URLSearchParams(), { email: "admin@unsrat.ac.id", password: "x" });
    const articles = await handleMockRequest("GET", "/articles", new URLSearchParams(), undefined) as Array<unknown>;
    expect(articles.length).toBeGreaterThan(0);
  });

  it("rute tidak dikenal mengembalikan 404", async () => {
    await expect(handleMockRequest("GET", "/tidak-ada", new URLSearchParams(), undefined)).rejects.toMatchObject({ status: 404 });
  });
});
