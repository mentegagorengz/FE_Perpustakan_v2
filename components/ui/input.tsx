"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, invalid, ...props }, ref) => (
  <input
    ref={ref}
    aria-invalid={invalid || undefined}
    className={cn(
      "w-full rounded-sm border border-main-border bg-cream-soft px-4 py-2.5 text-main-text outline-none transition-colors placeholder:text-main-text/40 focus:border-secondary focus:ring-1 focus:ring-secondary",
      invalid && "border-danger-border focus:border-danger-solid focus:ring-danger-solid",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";
