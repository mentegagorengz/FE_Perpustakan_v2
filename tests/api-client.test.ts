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

  it("tidak redirect, hanya melempar error saat response 401 dari area admin", async () => {
    const location = stubLocation("/dashboard");
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Sesi habis" }), { status: 401 })));

    await expect(http.get("/dashboard")).rejects.toThrow("Sesi habis");
    expect(location.href).toBe("");
  });

  it("tidak redirect, hanya melempar error saat response 401 dari area publik", async () => {
    const location = stubLocation("/koleksi");
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Sesi habis" }), { status: 401 })));

    await expect(http.get("/koleksi")).rejects.toThrow("Sesi habis");
    expect(location.href).toBe("");
  });

  it("fallback pesan sesi berakhir saat body error kosong", async () => {
    const location = stubLocation("/koleksi");
    const { http } = await loadApiClient();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 401 })));

    await expect(http.get("/koleksi")).rejects.toThrow("Sesi berakhir. Silakan login kembali.");
    expect(location.href).toBe("");
  });

  it("401 dari /auth/login tetap melempar (kredensial salah)", async () => {
    const { http } = await loadApiClient();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ message: "Email atau password salah." }), { status: 401 })),
    );

    await expect(http.post("/auth/login", { email: "a@b.c", password: "x" })).rejects.toThrow("Email atau password salah.");
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

  it("membuka envelope { statusCode, message, data } dari response backend", async () => {
    const { http } = await loadApiClient();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 200,
            message: "Success",
            data: { user: { id: 1, email: "admin@unsrat.ac.id" }, refreshToken: "rt-1" },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const result = await http.post<{ user: { id: number }; refreshToken: string }>("/auth/login", { email: "a@b.c", password: "x" });

    expect(result).toEqual({ user: { id: 1, email: "admin@unsrat.ac.id" }, refreshToken: "rt-1" });
  });

  it("membuka envelope paginated menjadi { data, meta }", async () => {
    const { http } = await loadApiClient();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 200,
            message: "Success",
            data: { data: [{ id: 1 }], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    );

    const result = await http.get<{ data: Array<{ id: number }>; meta: { total: number } }>("/books");

    expect(result).toEqual({ data: [{ id: 1 }], meta: { total: 1, page: 1, limit: 10, totalPages: 1 } });
  });
});
