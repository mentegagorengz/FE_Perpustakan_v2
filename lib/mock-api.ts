import { changeUserRole, getMockState, paginate, updateMockState, wait } from "@/lib/mockData";
import { AUTH_COOKIE, ROLES } from "@/lib/constants";
import type {
  ApiArticle,
  ApiError,
  ApiLog,
  ApiPolicy,
  ApiSession,
  ApiTransaction,
  ApiUser,
  ArticlePayload,
  DashboardSummary,
  LoginPayload,
  SystemRole,
} from "@/types/api";

const AUTH_ERROR = { message: "Sesi tidak valid atau sudah berakhir.", statusCode: 401 } satisfies ApiError;

export class MockHttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function readMockCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setMockCookie(value: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(value)}; Path=/; SameSite=Lax; Max-Age=86400`;
}

function clearMockCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0`;
}

function currentUser(): ApiUser {
  const raw = readMockCookie();
  if (!raw) throw new MockHttpError(401, AUTH_ERROR.message);
  const id = Number(raw.replace("dummy-", ""));
  const user = getMockState().users.find((item) => item.id === id);
  if (!user) throw new MockHttpError(401, AUTH_ERROR.message);
  return user;
}

function nextId(items: Array<{ id: number }>): number {
  return Math.max(0, ...items.map((item) => item.id)) + 1;
}

type MockHandler = (params: URLSearchParams, body: unknown) => Promise<unknown>;

function route(method: string, pathname: string): MockHandler | null {
  const login = async (_params: URLSearchParams, body: unknown) => {
    const { email, password } = body as LoginPayload;
    if (!password) throw new MockHttpError(400, "Kata sandi wajib diisi.");
    const user = getMockState().users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) throw new MockHttpError(400, "Akun tidak ditemukan. Gunakan admin@unsrat.ac.id, staff@unsrat.ac.id, atau mahasiswa@unsrat.ac.id.");
    setMockCookie(`dummy-${user.id}`);
    return { user } satisfies ApiSession;
  };

  const logout = async () => {
    clearMockCookie();
    return { success: true };
  };

  const me = async () => {
    const raw = readMockCookie();
    if (!raw) return { user: null } satisfies ApiSession;
    const user = getMockState().users.find((item) => item.id === Number(raw.replace("dummy-", "")));
    return { user: user ?? null } satisfies ApiSession;
  };

  const listBooks = async (params: URLSearchParams) => {
    const page = Number(params.get("page") ?? 1);
    const limit = Number(params.get("limit") ?? 100);
    const search = params.get("search")?.toLowerCase() ?? "";
    const state = getMockState();
    const books = state.books.filter((book) => !search || book.title.toLowerCase().includes(search));
    return paginate(books, page, limit);
  };

  const bookDetail = async (params: URLSearchParams) => {
    const id = Number(params.get("id"));
    const book = getMockState().books.find((item) => item.id === id);
    if (!book) throw new MockHttpError(404, "Buku tidak ditemukan.");
    return book;
  };

  const listArticles = async () => {
    const token = readMockCookie();
    const articles = getMockState().articles;
    return token ? articles : articles.filter((article) => article.is_published);
  };

  const articleDetail = async (params: URLSearchParams) => {
    const id = Number(params.get("id"));
    const article = getMockState().articles.find((item) => item.id === id);
    if (!article) throw new MockHttpError(404, "Arsip tidak ditemukan.");
    return article;
  };

  const createArticle = async (_params: URLSearchParams, body: unknown) => {
    const payload = body as ArticlePayload;
    const state = getMockState();
    const article: ApiArticle = {
      id: nextId(state.articles),
      title: payload.title,
      content: payload.content,
      image_url: payload.image_url ?? "",
      is_published: payload.is_published,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: { full_name: currentUser().full_name },
    };
    updateMockState((current) => ({ ...current, articles: [article, ...current.articles] }));
    return article;
  };

  const updateArticle = async (params: URLSearchParams, body: unknown) => {
    const id = Number(params.get("id"));
    const payload = body as ArticlePayload;
    updateMockState((state) => ({
      ...state,
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, title: payload.title, content: payload.content, image_url: payload.image_url ?? article.image_url, is_published: payload.is_published, updated_at: new Date().toISOString() }
          : article,
      ),
    }));
    return getMockState().articles.find((article) => article.id === id);
  };

  const deleteArticle = async (params: URLSearchParams) => {
    const id = Number(params.get("id"));
    updateMockState((state) => ({ ...state, articles: state.articles.filter((article) => article.id !== id) }));
    return { success: true };
  };

  const listTransactions = async (params: URLSearchParams) => {
    currentUser();
    const page = Number(params.get("page") ?? 1);
    const search = params.get("search")?.toLowerCase() ?? "";
    const transactions = getMockState().transactions.filter(
      (item) => !search || `${item.user?.full_name} ${item.bookItem?.book?.title}`.toLowerCase().includes(search),
    );
    return paginate(transactions, page, 10);
  };

  const borrow = async (_params: URLSearchParams, body: unknown) => {
    currentUser();
    const { barcode } = body as { barcode: string };
    const state = getMockState();
    const book = state.books.find((item) => item.items?.some((copy) => copy.barcode === barcode));
    const user = currentUser();
    const transaction: ApiTransaction = {
      id: nextId(state.transactions),
      borrowed_at: new Date().toISOString(),
      due_date: null,
      returned_at: null,
      fine_amount: 0,
      status: "BORROWED",
      user: { id: user.id, full_name: user.full_name, email: user.email },
      bookItem: { id: book?.items?.find((item) => item.barcode === barcode)?.id ?? 0, barcode, status: "BORROWED", book: book ? { id: book.id, title: book.title } : undefined },
    };
    updateMockState((current) => ({
      ...current,
      transactions: [transaction, ...current.transactions],
      books: current.books.map((item) => ({
        ...item,
        items: item.items?.map((copy) => (copy.barcode === barcode ? { ...copy, status: "BORROWED" as const } : copy)),
      })),
    }));
    return transaction;
  };

  const returnBook = async (_params: URLSearchParams, body: unknown) => {
    currentUser();
    const { barcode } = body as { barcode: string };
    updateMockState((state) => ({
      ...state,
      transactions: state.transactions.map((item) =>
        item.bookItem?.barcode === barcode ? { ...item, status: "RETURNED" as const, returned_at: new Date().toISOString() } : item,
      ),
      books: state.books.map((book) => ({
        ...book,
        items: book.items?.map((copy) => (copy.barcode === barcode ? { ...copy, status: "AVAILABLE" as const } : copy)),
      })),
    }));
    return { success: true };
  };

  const listUsers = async (params: URLSearchParams) => {
    currentUser();
    const page = Number(params.get("page") ?? 1);
    const search = params.get("search")?.toLowerCase() ?? "";
    const role = params.get("role");
    const users = getMockState().users.filter(
      (user) => (!search || `${user.full_name} ${user.email}`.toLowerCase().includes(search)) && (!role || user.role === role),
    );
    return paginate(users, page, 10);
  };

  const updateUserRole = async (params: URLSearchParams, body: unknown) => {
    currentUser();
    const id = Number(params.get("id"));
    const { role } = body as { role: SystemRole };
    updateMockState((state) => ({ ...state, users: changeUserRole(state.users, id, role) }));
    return getMockState().users.find((user) => user.id === id);
  };

  const deleteUser = async (params: URLSearchParams) => {
    currentUser();
    const id = Number(params.get("id"));
    updateMockState((state) => ({ ...state, users: state.users.filter((user) => user.id !== id) }));
    return { success: true };
  };

  const getPolicy = async () => {
    currentUser();
    return getMockState().policy;
  };

  const updatePolicy = async (_params: URLSearchParams, body: unknown) => {
    currentUser();
    const dto = body as Partial<Pick<ApiPolicy, "fine_per_day" | "loan_duration_days" | "max_books_per_user">>;
    updateMockState((state) => ({ ...state, policy: { ...state.policy, ...dto } }));
    return getMockState().policy;
  };

  const dashboardSummary = async () => {
    currentUser();
    const state = getMockState();
    const summary: DashboardSummary = {
      total_books: state.books.length,
      total_users: state.users.length,
      login_attempts: state.logs.filter((log) => log.action === "LOGIN").length,
      failed_actions: state.logs.filter((log) => log.status === "FAILED").length,
      server_status: "MODE DUMMY",
      last_updated: new Date().toISOString(),
      total_logs: state.logs.length,
    };
    return summary;
  };

  const listLogs = async (params: URLSearchParams) => {
    currentUser();
    const page = Number(params.get("page") ?? 1);
    const action = params.get("action");
    const logs: ApiLog[] = getMockState().logs.filter((log) => action === "all" || !action || log.action === action);
    return paginate(logs, page, 10);
  };

  const articleById = async (params: URLSearchParams, body: unknown): Promise<unknown> => {
    if (method === "GET") return articleDetail(params);
    if (method === "PATCH") return updateArticle(params, body);
    if (method === "DELETE") return deleteArticle(params);
    throw new MockHttpError(404, `Endpoint mock tidak ditemukan: ${method} ${pathname}`);
  };

  const get = (pattern: RegExp, handler: MockHandler | null) => ({ method, pattern, handler });

  const table = [
    get(/^\/auth\/login$/, login),
    get(/^\/auth\/logout$/, logout),
    get(/^\/auth\/me$/, me),
    get(/^\/books$/, listBooks),
    get(/^\/books\/(\d+)$/, (params) => bookDetail(params)),
    get(/^\/articles$/, method === "GET" ? listArticles : method === "POST" ? createArticle : null),
    get(/^\/articles\/(\d+)$/, articleById),
    get(/^\/transactions$/, listTransactions),
    get(/^\/transactions\/borrow$/, borrow),
    get(/^\/transactions\/return$/, returnBook),
    get(/^\/users$/, listUsers),
    get(/^\/users\/(\d+)\/role$/, (params, body) => updateUserRole(params, body)),
    get(/^\/users\/(\d+)$/, (params) => deleteUser(params)),
    get(/^\/policy$/, method === "GET" ? getPolicy : updatePolicy),
    get(/^\/dashboard\/summary$/, dashboardSummary),
    get(/^\/activity-logs$/, listLogs),
  ] as const;

  for (const entry of table) {
    if (entry.handler && entry.pattern.test(pathname)) {
      const params = new URLSearchParams();
      const match = pathname.match(entry.pattern);
      if (match?.[1]) params.set("id", match[1]);
      return entry.handler;
    }
  }
  return null;
}

export async function handleMockRequest(method: string, pathname: string, params: URLSearchParams, body: unknown): Promise<unknown> {
  const handler = route(method, pathname);
  if (!handler) throw new MockHttpError(404, `Endpoint mock tidak ditemukan: ${method} ${pathname}`);
  return wait(handler(params, body));
}

export const MOCK_ENABLED = process.env.NEXT_PUBLIC_MOCK_API !== "false";
export { ROLES };
