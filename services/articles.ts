import { http } from "@/lib/api-client";
import type { ApiArticle, ArticlePayload } from "@/types/api";

export const articlesApi = {
  list() {
    return http.get<ApiArticle[]>("/articles");
  },
  detail(id: string) {
    return http.get<ApiArticle>(`/articles/${id}`);
  },
  create(payload: ArticlePayload) {
    return http.post<ApiArticle>("/articles", payload);
  },
  update(id: number, payload: ArticlePayload) {
    return http.patch<ApiArticle>(`/articles/${id}`, payload);
  },
  remove(id: number) {
    return http.delete<{ success: boolean }>(`/articles/${id}`);
  },
};