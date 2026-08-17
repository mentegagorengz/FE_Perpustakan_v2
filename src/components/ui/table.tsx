"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Table = ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => (
  <div className="w-full overflow-x-auto">
    <table className={cn("w-full text-left text-sm", className)} {...props} />
  </div>
);
Table.displayName = "Table";

export const THead = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("border-b border-main-border bg-surface text-xs uppercase tracking-wider text-main-text-muted", className)} {...props} />
);
THead.displayName = "THead";

export const TBody = ({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("divide-y divide-main-border", className)} {...props} />
);
TBody.displayName = "TBody";

export const TRow = ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("transition-colors hover:bg-surface", className)} {...props} />
);
TRow.displayName = "TRow";

export const THeadCell = ({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th className={cn("px-4 py-3 font-semibold", className)} {...props} />
);
THeadCell.displayName = "THeadCell";

export const TCell = ({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3", className)} {...props} />
);
TCell.displayName = "TCell";

export const TEmpty = ({ colSpan, children }: { colSpan: number; children: React.ReactNode }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-8 text-center text-main-text-muted">
      {children}
    </td>
  </tr>
);
TEmpty.displayName = "TEmpty";
