"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = {
  primary: "bg-secondary text-white hover:bg-secondary-hover",
  outline: "border border-main-border bg-paper text-main-text hover:bg-surface",
  ghost: "text-main-text-muted hover:bg-surface hover:text-main-text",
  danger: "bg-danger-solid text-white hover:bg-danger-solid-hover",
  dangerOutline: "border border-main-border text-danger-text hover:bg-danger-surface",
} as const;

type ButtonVariant = keyof typeof buttonVariants;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
          buttonVariants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
