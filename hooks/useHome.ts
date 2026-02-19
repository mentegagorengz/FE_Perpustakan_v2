"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function useHome(itemCount: number) {
    const router = useRouter();
    const [currentIndex, seetCurrentIndex] = useState(0);

    useEffect(() => {
        if (itemCount <= 1) return;
        const interval = setInterval(() => {
            seetCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, [itemCount]);

    const handleSearchBook = useCallback(() => {
        router.push("/koleksi");
    }, [router]);

    const handleOpenJournal = useCallback((Link: string) => {
        window.open(Link, "_blank");
    }, []);

    return {
        currentIndex,
        handleSearchBook,
        handleOpenJournal,
    };
}