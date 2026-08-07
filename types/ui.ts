import type { ReactNode } from "react";
import type { ApiBookItem } from "@/types/api";

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

export type ToastType = "success" | "error";

export interface ToastMessage {
  message: string;
  type: ToastType;
}

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "right";
  width?: string;
}
