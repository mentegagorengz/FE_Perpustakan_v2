import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

async function loadApiClient() {
  vi.resetModules();
  vi.stubGlobal("fetch", vi.fn());
  const api = await import("@/lib/api-client");
  return api;
}

function stubLocation(pathname: string) {
  const location = { pathname, href: "" };
  Object.defineProperty(window, "location", { writable: true, value: location });
  return location;
}

describe("apiClient (mode real)", () => {
  const originalEnv = process.env.NEXT_PUBLIC_MOCK_API;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_MOCK_API = "false";
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_MOCK_API = originalEnv;
    vi.unstubAllGlobals();
  });

  it("menambahkan credentials include dan header JSON", async () => {
    const { http } = await loadApiClient();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await http.get("/books");

    const [url, config] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/books");
    expect(config.credentials).toBe("include");
    expect(config.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("menserialisasi query parameter dan mengabaikan undefined", async () => {
    const { http } = await loadApiClient();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: [] }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await http.get("/books", { params: { page: 2, search: "algoritma", role: undefined } });

    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain("/api/books?page=2&search=algoritma");
    expect(url).not.toContain("role");
  });

  it("menormalkan error API ke Error dengan pesan dari body", async () => {
    const { http } = await loadApiClient();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Buku tidak ditemukan." }), { status: 404, headers: { "Content-Type": "application/json" } }),
      ),
    );

    await expect(http.get("/books/999")).rejects.toThrow("Buku tidak ditemukan.");
  });

  it("melempar pesan fallback saat body error kosong", async () => {
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));

    await expect(http.get("/books")).rejects.toThrow(/HTTP Error: 500/);
  });

  it("redirect ke login saat response 401", async () => {
    const location = stubLocation("/dashboard");
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Sesi habis" }), { status: 401 })));

    await expect(http.get("/dashboard")).rejects.toThrow("Sesi habis");
    expect(location.href).toBe("/login?redirect=%2Fdashboard");
  });

  it("tidak redirect ke login saat sudah berada di halaman login", async () => {
    const location = stubLocation("/login");
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Sesi habis" }), { status: 401 })));

    await expect(http.get("/auth/me")).rejects.toThrow();
    expect(location.href).toBe("");
  });

  it("mengirim body POST sebagai JSON", async () => {
    const { http } = await loadApiClient();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200, headers: { "Content-Type": "application/json" } }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await http.post("/auth/login", { email: "a@b.c", password: "x" });

    const [, config] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(config.body).toBe(JSON.stringify({ email: "a@b.c", password: "x" }));
    expect(config.method).toBe("POST");
  });
});
