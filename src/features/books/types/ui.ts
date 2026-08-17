import type { ApiBookItem } from "./api";

export interface UiBook {
  id: number;
  title: string;
  mainAuthor: string;
  category: string;
  imageUrl: string;
  description: string;
  isbn: string;
  publisher: string;
  year: string;
  language: string;
  subtitle: string;
  contributors: string;
  edition: string;
  gmd: string;
  publicationCity: string;
  physicalDescription: string;
  classificationNumber: string;
  callNumber: string;
  subjects: string[];
  attachmentUrl: string;
  items: ApiBookItem[];
}
