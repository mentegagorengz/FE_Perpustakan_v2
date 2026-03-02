"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useHome(itemCount: number) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (itemCount <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [itemCount]);

  const handleSearchBook = useCallback(() => {
    router.push("/koleksi");
  }, [router]);

  const handleOpenJournal = useCallback((link: string) => {
    window.open(link, "_blank");
  }, []);

  return {
    currentIndex,
    handleSearchBook,
    handleOpenJournal,
  };
}
