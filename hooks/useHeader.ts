"use client";

import { useState, useCallback, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { log } from "console";

export function useHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const onLogout = useCallback(() => {
    logout();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  }, [logout]);

  return {
    user,
    isAuthenticated,
    isMenuOpen,
    showToast,
    toggleMenu,
    onLogout,
  };
}
