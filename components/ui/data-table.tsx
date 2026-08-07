"use client";

import * as React from "react";
import { Search, AlertCircle } from "lucide-react";
import type { Column } from "@/types/ui";
import { Table, THead, TBody, TRow, THeadCell, TCell, TEmpty } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  isLoading?: boolean;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  error?: string | null;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyField,
  isLoading = false,
  page,
  totalPages = 1,
  onPageChange,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Cari...",
  emptyTitle = "Tidak ada data",
  emptyDescription,
  error,
  className,
}: DataTableProps<T>) {
  const showSearch = searchValue !== undefined && onSearchChange !== undefined;

  return (
    <div className={cn("space-y-4", className)}>
      {showSearch && (
        <div className="relative w-full max-w-sm">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-main-text-muted" />
          <Input value={searchValue} onChange={(e) => onSearchChange(e.target.value)} placeholder={searchPlaceholder} className="pl-9" />
        </div>
      )}

      <div className="overflow-hidden rounded-md border border-main-border bg-paper shadow-[var(--shadow-card)]">
        <Table>
          <THead>
            <tr>
              {columns.map((col) => (
                <THeadCell key={String(col.key)} className={cn(col.align === "right" && "text-right")}>
                  {col.header}
                </THeadCell>
              ))}
            </tr>
          </THead>
          <TBody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8">
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-5 w-full" />
                    ))}
                  </div>
                </td>
              </tr>
            ) : error ? (
              <TEmpty colSpan={columns.length}>
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle aria-hidden="true" className="h-8 w-8 text-danger-solid" />
                  <span className="text-sm font-semibold text-danger-text">{error}</span>
                </div>
              </TEmpty>
            ) : data.length === 0 ? (
              <TEmpty colSpan={columns.length}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </TEmpty>
            ) : (
              data.map((row) => (
                <TRow key={String(row[keyField])}>
                  {columns.map((col) => (
                    <TCell
                      key={String(col.key)}
                      className={cn(
                        col.align === "right" && "text-right",
                        col.width && `w-[${col.width}]`,
                      )}
                    >
                      {col.render ? col.render(row) : String(row[col.key] ?? "-")}
                    </TCell>
                  ))}
                </TRow>
              ))
            )}
          </TBody>
        </Table>
      </div>

      {onPageChange && (
        <Pagination page={page ?? 1} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
}
