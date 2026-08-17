import * as React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex items-center gap-3">
        {icon && <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-secondary/10 text-secondary">{icon}</span>}
        <div>
          <h1 className="text-xl font-bold text-main-text sm:text-2xl">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-main-text-muted">{description}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
