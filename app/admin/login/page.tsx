"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { loginSchema, type LoginFormValues } from "@/lib/schemas";
import { LOGIN_ROUTE } from "@/lib/constants";
import { sanitizeRedirect } from "@/lib/utils";

export default function AdminLoginPage() {
  const { login, logout, isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [gateError, setGateError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const redirect = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("redirect");

  useEffect(() => {
    if (!isAuthenticated || rejecting) return;
    if (user?.role === "SUPER_ADMIN" || user?.role === "STAFF") {
      router.replace("/dashboard");
      return;
    }
    if (user?.role === "USER") {
      setRejecting(true);
      setGateError("Akun ini tidak memiliki akses ke panel manajemen.");
      logout().catch(() => {});
    }
  }, [isAuthenticated, logout, rejecting, router, user?.role]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    let session;
    try {
      session = await login(values.email, values.password);
    } catch (err) {
      setError("root", { message: err instanceof Error ? err.message : "Terjadi kesalahan koneksi." });
      return;
    }
    if (session.user?.role === "USER") {
      await logout();
      setError("root", { message: "Akun ini tidak memiliki akses ke panel manajemen." });
      return;
    }
    router.replace(sanitizeRedirect(redirect) ?? "/dashboard");
  };

  const displayError = gateError ?? errors.root?.message;

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-main-border bg-white p-8 shadow-[var(--shadow-card)]">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-secondary text-white">
                <BookOpen aria-hidden="true" size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-3xl font-display text-secondary">Panel Manajemen</h1>
                <p className="mt-2 text-sm text-main-text/60">Akses staf &amp; pengelola Perpustakaan</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              {displayError && (
                <div id="login-error" role="alert" className="rounded-sm border border-danger-border bg-danger-surface px-4 py-3 text-sm text-danger-text">
                  {displayError}
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-main-text">
                  Email / Identitas
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full rounded-sm border border-main-border bg-cream-soft px-4 py-2.5 text-main-text outline-none transition-colors placeholder:text-main-text/40 focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="nama@unsrat.ac.id"
                  disabled={isLoading}
                  {...register("email")}
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-danger-text">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-main-text">
                  Kata Sandi
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={errors.password ? true : undefined}
                  aria-describedby={errors.password ? "password-error" : undefined}
                  className="w-full rounded-sm border border-main-border bg-cream-soft px-4 py-2.5 text-main-text outline-none transition-colors placeholder:text-main-text/40 focus:border-secondary focus:ring-1 focus:ring-secondary"
                  placeholder="••••••••"
                  disabled={isLoading}
                  {...register("password")}
                />
                {errors.password && (
                  <p id="password-error" className="text-xs text-danger-text">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-sm bg-secondary py-3 font-medium text-white transition-colors hover:bg-secondary-hover disabled:opacity-50"
              >
                {isLoading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                {isLoading ? "Memverifikasi..." : "Masuk ke Panel"}
              </button>
            </form>
            <div className="mt-6 border-t border-main-border pt-5 text-center">
              <Link href={LOGIN_ROUTE} className="text-sm text-secondary underline-offset-4 hover:underline">
                Anggota Perpustakaan? Masuk ke Portal Publik
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}