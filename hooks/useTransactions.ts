import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { getMockState, paginate, updateMockState, wait } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";
import type { ApiTransaction, Paginated } from "@/types/api";

export function useBorrowMutation() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barcode: string) => {
      const state = getMockState();
      const book = state.books.find((item) => item.items?.some((copy) => copy.barcode === barcode));
      const transaction: ApiTransaction = { id: Math.max(0, ...state.transactions.map((item) => item.id)) + 1, borrowed_at: new Date().toISOString(), due_date: null, returned_at: null, fine_amount: 0, status: "BORROWED", user: { id: user?.id ?? 0, full_name: user?.full_name ?? user?.nama ?? "Pengguna Dummy", email: user?.email ?? "dummy@unsrat.ac.id" }, bookItem: { id: book?.items?.find((item) => item.barcode === barcode)?.id ?? 0, barcode, status: "BORROWED", book: book ? { id: book.id, title: book.title } : undefined } };
      return wait(updateMockState((current) => ({ ...current, transactions: [transaction, ...current.transactions], books: current.books.map((item) => ({ ...item, items: item.items?.map((copy) => copy.barcode === barcode ? { ...copy, status: "BORROWED" } : copy) })) })));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["books"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useTransactionsList(params: {
  token: string | null;
  page: number;
  search?: string;
}) {
  const { token, page, search } = params;
  return useQuery({
    queryKey: ["transactions", { page, search }],
    queryFn: async () => {
      const transactions = getMockState().transactions.filter((item) => !search || `${item.user?.full_name} ${item.bookItem?.book?.title}`.toLowerCase().includes(search.toLowerCase()));
      return wait(paginate(transactions, page, 10) as Paginated<ApiTransaction>);
    },
    enabled: !!token,
    placeholderData: keepPreviousData,
  });
}

export function useReturnMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (barcode: string) => {
      return wait(updateMockState((state) => ({ ...state, transactions: state.transactions.map((item) => item.bookItem?.barcode === barcode ? { ...item, status: "RETURNED", returned_at: new Date().toISOString() } : item), books: state.books.map((book) => ({ ...book, items: book.items?.map((copy) => copy.barcode === barcode ? { ...copy, status: "AVAILABLE" } : copy) })) })));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
