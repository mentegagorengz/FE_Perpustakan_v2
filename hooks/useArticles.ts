"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMockState, updateMockState, wait, type MockArticle } from "@/lib/mockData";

export interface Article {
  id?: number;
  title: string;
  content: string;
  image_url: string;
  is_published: boolean;
  created_at?: string;
  author?: {
    full_name: string;
  };
}

export function useArticles(token: string | null) {
  const queryClient = useQueryClient();

  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const articles = getMockState().articles;
      return wait(token ? articles : articles.filter((article) => article.is_published));
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const state = getMockState();
      const article: MockArticle = { id: Math.max(0, ...state.articles.map((item) => item.id)) + 1, title: String(formData.get("title")), content: String(formData.get("content")), image_url: "", is_published: formData.get("is_published") === "true", created_at: new Date().toISOString(), author: { full_name: "Admin Perpustakaan" } };
      return wait(updateMockState((current) => ({ ...current, articles: [article, ...current.articles] })));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      return wait(updateMockState((state) => ({ ...state, articles: state.articles.map((article) => article.id === id ? { ...article, title: String(data.get("title")), content: String(data.get("content")), is_published: data.get("is_published") === "true" } : article) })));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return wait(updateMockState((state) => ({ ...state, articles: state.articles.filter((article) => article.id !== id) })));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  return {
    articles: articlesQuery.data || [],
    isLoading: articlesQuery.isLoading,
    createArticle: createMutation.mutate,
    updateArticle: updateMutation.mutate,
    deleteArticle: deleteMutation.mutate,
    articleError: createMutation.error || updateMutation.error || deleteMutation.error,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

export function useArticleDetail(id: string | null) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      return wait(getMockState().articles.find((article) => article.id === Number(id)));
    },
    enabled: !!id,
  });
}
