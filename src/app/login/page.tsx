"use client";

import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/layout/header";
import { useAuth } from "@/features/auth";
import { loginSchema, type LoginFormValues } from "@/features/auth";
import { ADMIN_LOGIN_ROUTE, ADMIN_ROLES } from "@/lib/constants";
import { sanitizeRedirect } from "@/lib/utils";

export default function LoginPage() {
  const { login, isLoading, user, isAuthenticated } = useAuth();
  const router = useRouter();
  const redirect = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("redirect");

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.role && (ADMIN_ROLES as readonly string[]).includes(user.role)) {
      router.replace(ADMIN_LOGIN_ROUTE);
    }
  }, [isLoading, isAuthenticated, user?.role, router]);

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
    if (session.user?.role && (ADMIN_ROLES as readonly string[]).includes(session.user.role)) {
      router.replace(ADMIN_LOGIN_ROUTE);
      return;
    }
    router.replace(sanitizeRedirect(redirect) ?? "/");
  };

  const displayError = errors.root?.message;

  return (
    <div className="min-h-screen flex flex-col bg-cream font-sans">
      <Header />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-sm border border-main-border bg-white p-8 shadow-[var(--shadow-card)]">
            <div className="mb-8">
              <h1 className="text-3xl font-display text-secondary">Portal Masuk</h1>
              <p className="mt-2 text-sm text-main-text/60">Akses mandiri Perpustakaan</p>
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
                  placeholder="nama@mahasiswa.example"
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
                {isLoading ? "Memverifikasi..." : "Masuk Sekarang"}
              </button>
            </form>
            <div className="mt-6 border-t border-main-border pt-5 text-center">
              <Link href={ADMIN_LOGIN_ROUTE} className="text-sm text-secondary underline-offset-4 hover:underline">
                Staf &amp; Manajemen? Masuk ke Panel Manajemen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
