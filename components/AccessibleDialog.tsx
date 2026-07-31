"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

interface AccessibleDialogProps {
  children: ReactNode;
  titleId: string;
  descriptionId?: string;
  onClose: () => void;
  className: string;
  overlayClassName?: string;
  active?: boolean;
}

export default function AccessibleDialog({
  children,
  titleId,
  descriptionId,
  onClose,
  className,
  overlayClassName = "z-50 bg-black/50",
  active = true,
}: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialogRef.current?.querySelector<HTMLElement>(focusableSelector)?.focus();

    return () => {
      returnFocusRef.current?.focus();
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active]);

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (active && event.target === event.currentTarget) onClose();
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 ${overlayClassName}`} onMouseDown={closeFromBackdrop}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal={active ? "true" : undefined}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        aria-hidden={active ? undefined : true}
        inert={active ? undefined : true}
        tabIndex={-1}
        className={className}
      >
        {children}
      </div>
    </div>
  );
}
