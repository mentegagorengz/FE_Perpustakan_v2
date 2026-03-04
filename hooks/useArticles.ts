"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

  // 1. Fetching Semua Artikel (Publik/Admin)
  const articlesQuery = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const headers: HeadersInit = {};
      if (token) headers["Authorization"] = `Bearer ${token}`; // Tambah token jika ada

      const response = await fetch("http://localhost:3001/api/v1/articles", { headers });
      if (!response.ok) throw new Error("Gagal memuat artikel");
      const result = await response.json();
      return result.data;
    },
    // Tetap jalan di publik (tanpa token), tapi butuh token di admin
    // Kita hapus enabled: !!token agar halaman publik bisa fetch data
  });

  // 2. Mutation: Tambah Artikel Baru
  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("http://localhost:3001/api/v1/articles", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData, // Mengirim file + teks
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  // 3. Mutation: Update Artikel (PENTING!)
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FormData }) => {
      const response = await fetch(`http://localhost:3001/api/v1/articles/${id}`, {
        method: "PATCH", // Gunakan PATCH sesuai standar REST
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      return response.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  // 4. Mutation: Hapus Artikel
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`http://localhost:3001/api/v1/activity-logs/${id}`, {
        // Sesuaikan endpoint
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["articles"] }),
  });

  return {
    articles: articlesQuery.data || [],
    isLoading: articlesQuery.isLoading,
    createArticle: createMutation.mutate,
    updateArticle: updateMutation.mutate, // Tambahkan ini agar bisa edit
    deleteArticle: deleteMutation.mutate,
    isProcessing: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  };
}

// Hook tambahan untuk detail agar tidak campur aduk
export function useArticleDetail(id: string | null) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/api/v1/articles/${id}`);
      if (!response.ok) throw new Error("Gagal memuat detail artikel");
      const result = await response.json();
      return result.data;
    },
    enabled: !!id,
  });
}
