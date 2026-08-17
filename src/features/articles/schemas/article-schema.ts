import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().trim().min(1, "Judul wajib diisi.").max(200, "Judul maksimal 200 karakter."),
  content: z.string().trim().min(1, "Konten wajib diisi."),
  is_published: z.boolean(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;