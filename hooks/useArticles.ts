"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL, handleApiResponse } from "@/constants/api";

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
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/articles`, { headers });
      const result = await handleApiResponse(response);
      return result.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      return handleApiResponse(response);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      return handleApiResponse(response);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      return handleApiResponse(response);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  return {
    articles: articlesQuery.data || [],
    isLoading: articlesQuery.isLoading,
    createArticle: createMutation.mutate,
    updateArticle: updateMutation.mutate,
    deleteArticle: deleteMutation.mutate,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

export function useArticleDetail(id: string | null) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      const result = await handleApiResponse(response);
      return result.data;
    },
    enabled: !!id,
  });
}

