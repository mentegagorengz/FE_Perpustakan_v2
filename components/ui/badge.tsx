import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  neutral: "bg-surface text-main-text-muted border-main-border",
  success: "bg-success-surface text-success-text border-success-border",
  danger: "bg-danger-surface text-danger-text border-danger-border",
  warning: "bg-warning-surface text-warning-text border-warning-border",
  primary: "bg-secondary/10 text-secondary border-secondary/30",
} as const;

type BadgeVariant = keyof typeof badgeVariants;

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
