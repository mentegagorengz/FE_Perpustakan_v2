import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email wajib diisi.").email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const policySchema = z.object({
  fine_per_day: z.coerce.number().int("Denda harus bilangan bulat.").min(0, "Denda minimal 0."),
  loan_duration_days: z.coerce.number().int("Durasi harus bilangan bulat.").min(1, "Durasi minimal 1 hari."),
  max_books_per_user: z.coerce.number().int("Jumlah harus bilangan bulat.").min(1, "Minimal 1 buku."),
});

export type PolicyFormValues = z.infer<typeof policySchema>;

export const articleSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Judul maksimal 200 karakter."),
  content: z.string().trim().min(1, "Konten wajib diisi."),
  is_published: z.boolean(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;
