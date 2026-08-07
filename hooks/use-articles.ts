"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "@/lib/api-client";
import { queryKeys } from "@/lib/constants";
import type { ApiArticle, ArticlePayload } from "@/types/api";

export function useArticles(enabled = true) {
  const queryClient = useQueryClient();

  const articlesQuery = useQuery({
    queryKey: queryKeys.articles(),
    queryFn: () => http.get<ApiArticle[]>("/articles"),
    enabled,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ArticlePayload) => http.post<ApiArticle>("/articles", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ArticlePayload }) => http.patch<ApiArticle>(`/articles/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => http.delete<{ success: boolean }>(`/articles/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles() }),
  });

  return {
    articles: articlesQuery.data ?? [],
    isLoading: articlesQuery.isLoading,
    createArticle: createMutation.mutate,
    updateArticle: updateMutation.mutate,
    deleteArticle: deleteMutation.mutate,
    articleError: createMutation.error ?? updateMutation.error ?? deleteMutation.error,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

export function useArticleDetail(id: string | null) {
  return useQuery({
    queryKey: queryKeys.articleDetail(id),
    queryFn: () => http.get<ApiArticle>(`/articles/${id}`),
    enabled: id != null,
    placeholderData: keepPreviousData,
  });
}
