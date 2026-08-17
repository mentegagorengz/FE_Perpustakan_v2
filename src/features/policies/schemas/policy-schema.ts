import { z } from "zod";

export const policySchema = z.object({
  fine_per_day: z.coerce.number().int("Denda harus bilangan bulat.").min(0, "Denda minimal 0."),
  loan_duration_days: z.coerce.number().int("Durasi harus bilangan bulat.").min(1, "Durasi minimal 1 hari."),
  max_books_per_user: z.coerce.number().int("Jumlah harus bilangan bulat.").min(1, "Minimal 1 buku."),
});

export type PolicyFormValues = z.infer<typeof policySchema>;