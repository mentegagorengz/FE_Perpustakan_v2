"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { articlesApi } from "@/services/articles";
import { queryKeys } from "@/lib/constants";
import type { ArticlePayload } from "@/types/api";

export function useArticles(enabled = true) {
  const queryClient = useQueryClient();

  const articlesQuery = useQuery({
    queryKey: queryKeys.articles(),
    queryFn: articlesApi.list,
    enabled,
  });

  const createMutation = useMutation({
    mutationFn: (payload: ArticlePayload) => articlesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles() }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ArticlePayload }) => articlesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.articles() }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => articlesApi.remove(id),
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
    queryFn: () => articlesApi.detail(id as string),
    enabled: id != null,
    placeholderData: keepPreviousData,
  });
}