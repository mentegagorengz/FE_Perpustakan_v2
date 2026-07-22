"use client";

import { useState, useEffect } from "react";

export function useNews() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("general");

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY || "";
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
  }, [category]);

  return { articles, loading, setCategory, category };
}
