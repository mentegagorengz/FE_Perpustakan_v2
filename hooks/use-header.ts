"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export function useHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const onLogout = useCallback(() => {
    void logout();
    toast("Sampai jumpa kembali.");
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isMenuOpen,
    toggleMenu,
    onLogout,
  };
}
