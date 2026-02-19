"use client";

import { useState, useEffect } from "react";

export function useNews() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("general"); // Default kategori umum

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const API_KEY = "ca8d26ecd8274f4671495bea04c39297";
        const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=id&country=id&apikey=${API_KEY}`);
        const data = await response.json();
        setArticles(data.articles || []);
      } catch (error) {
        console.error("Gagal memuat berita:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]); // Fetch ulang setiap kategori berubah

  return { articles, loading, setCategory, category };
}
