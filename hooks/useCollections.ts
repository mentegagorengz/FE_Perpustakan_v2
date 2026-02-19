"use client";

import { useCallback } from "react";

export function useCollections() {
  const handleExternalLink = useCallback((url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return {
    handleExternalLink,
  };
}
