"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface Article {
  id?: number;
  title: string;
  content: string;
  image_url: string;
  is_published: boolean;
  created_at?: string;
}

export function useArticles(token: string | null) {
  const queryClient = useQueryClient();

  // 1. Fetching Data Artikel 
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3001/api/v1/articles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat artikel");
      const result = await response.json();
      return result.data;
    },
    enabled: !!token,
  });

  // 2. Mutation: Tambah Artikel Baru 
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("http://localhost:3001/api/v1/articles", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      return response.json();
    },
    onSuccess: () => {
      // Refresh cache agar daftar artikel langsung terupdate 
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  // 3. Mutation: Hapus Artikel 
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3001/api/v1/articles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return {
    articles: articlesQuery.data || [],
    isLoading: articlesQuery.isLoading,
    createArticle: createMutation.mutate,
    deleteArticle: deleteMutation.mutate,
    isProcessing: createMutation.isPending || deleteMutation.isPending,
  };
}
