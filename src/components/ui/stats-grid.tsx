import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsGridProps {
  items: Array<{
    label: string;
    value: ReactNode;
    icon: ReactNode;
    hint?: string;
  }>;
  isLoading?: boolean;
  className?: string;
}

export function StatsGrid({ items, isLoading = false, className }: StatsGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3 lg:grid-cols-4", className)}>
      {items.map((item) => (
        <div key={item.label} className="rounded-md border border-main-border bg-paper p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-main-text-muted">{item.label}</span>
            <span className="text-secondary">{item.icon}</span>
          </div>
          {isLoading ? (
            <Skeleton className="mt-2 h-8 w-16" />
          ) : (
            <div className="mt-1 text-2xl font-bold text-main-text">{item.value}</div>
          )}
          {item.hint && !isLoading && <div className="mt-0.5 text-xs text-main-text-muted">{item.hint}</div>}
        </div>
      ))}
    </div>
  );
}
