export interface ApiArticle {
  id: number;
  title: string;
  content: string;
  image_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  author?: { full_name: string };
}

export interface ArticlePayload {
  title: string;
  content: string;
  image_url?: string;
  is_published: boolean;
}