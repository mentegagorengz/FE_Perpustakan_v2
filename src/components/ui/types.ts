import type { ReactNode } from "react";

export interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => ReactNode;
  align?: "left" | "right";
  width?: string;
}
