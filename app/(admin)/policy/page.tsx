"use client";

import { useEffect } from "react";
import { Loader2, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/auth-context";
import { usePolicy, useUpdatePolicyMutation } from "@/hooks/use-policy";
import { policySchema, type PolicyFormValues } from "@/lib/schemas";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PolicyPage() {
  const { isAuthenticated } = useAuth();
  const { data: policy } = usePolicy(isAuthenticated);
  const updatePolicy = useUpdatePolicyMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PolicyFormValues>({
    resolver: zodResolver(policySchema),
    defaultValues: { fine_per_day: 0, loan_duration_days: 7, max_books_per_user: 2 },
  });

  useEffect(() => {
    if (policy) reset({ fine_per_day: policy.fine_per_day, loan_duration_days: policy.loan_duration_days, max_books_per_user: policy.max_books_per_user });
  }, [policy, reset]);

  const onSubmit = async (values: PolicyFormValues) => {
    try {
      await updatePolicy.mutateAsync(values);
      toast.success("Kebijakan disimpan!");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal menyimpan kebijakan.");
    }
  };

  return (
    <div className="min-h-screen bg-cream p-4 font-sans sm:p-6 lg:p-10">
      <PageHeader
        title="Kebijakan & Denda"
        description="Atur parameter denda harian dan kebijakan peminjaman."
        icon={<Wallet size={20} />}
        className="mb-8 border-b border-main-border pb-6"
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="rounded-sm border border-main-border bg-secondary p-5 text-white shadow-[var(--shadow-card)] sm:p-8">
          <h3 className="mb-8 font-display text-lg text-white">Pengaturan finansial</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
            <div>
              <label htmlFor="daily-fine" className="mb-2 block text-sm text-white/70">
                Denda telat per hari (Rp)
              </label>
              <Input id="daily-fine" type="number" min="0" step="1" invalid={!!errors.fine_per_day} className="border-white/20 bg-white/10 font-medium text-white placeholder:text-white/50" {...register("fine_per_day")} />
              {errors.fine_per_day && <p role="alert" className="mt-1 text-xs text-warning-solid">{errors.fine_per_day.message}</p>}
            </div>
            <div>
              <label htmlFor="max-days" className="mb-2 block text-sm text-white/70">
                Maks hari peminjaman
              </label>
              <Input id="max-days" type="number" min="1" step="1" invalid={!!errors.loan_duration_days} className="border-white/20 bg-white/10 font-medium text-white placeholder:text-white/50" {...register("loan_duration_days")} />
              {errors.loan_duration_days && <p role="alert" className="mt-1 text-xs text-warning-solid">{errors.loan_duration_days.message}</p>}
            </div>
            <div>
              <label htmlFor="max-books" className="mb-2 block text-sm text-white/70">
                Maks buku per user
              </label>
              <Input id="max-books" type="number" min="1" step="1" invalid={!!errors.max_books_per_user} className="border-white/20 bg-white/10 font-medium text-white placeholder:text-white/50" {...register("max_books_per_user")} />
              {errors.max_books_per_user && <p role="alert" className="mt-1 text-xs text-warning-solid">{errors.max_books_per_user.message}</p>}
            </div>
            <Button type="submit" variant="outline" disabled={updatePolicy.isPending} className="w-full bg-white py-3 text-secondary hover:bg-cream-soft">
              {updatePolicy.isPending && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
              {updatePolicy.isPending ? "Menyimpan..." : "Simpan kebijakan"}
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-sm border border-main-border bg-paper p-5 shadow-[var(--shadow-card)] sm:p-8">
            <h3 className="mb-6 font-display text-lg text-main-text">Kebijakan aktif</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text-muted">Denda harian</span>
                <span className="font-medium text-secondary">Rp {(policy?.fine_per_day ?? 0).toLocaleString("id-ID")}</span>
              </div>
              <div className="flex items-center justify-between border-b border-main-border pb-3">
                <span className="text-sm text-main-text-muted">Maks hari pinjam</span>
                <span className="font-medium text-secondary">{policy?.loan_duration_days ?? "-"} hari</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-main-text-muted">Maks buku/user</span>
                <span className="font-medium text-secondary">{policy?.max_books_per_user ?? "-"} buku</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
