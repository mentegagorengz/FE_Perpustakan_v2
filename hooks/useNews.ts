"use client";

import { useState } from "react";

export function useNews() {
  const [articles] = useState<any[]>([
    { title: "Layanan literasi informasi tersedia untuk sivitas akademika", description: "Konten dummy berita perpustakaan.", publishedAt: "2024-03-01" },
  ]);
  const [loading] = useState(false);
  const [category, setCategory] = useState("general");

  return { articles, loading, setCategory, category };
}
