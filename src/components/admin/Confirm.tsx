"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Native <dialog> confirmation. Gives us focus trapping, Escape-to-close and
 * inert background for free, with no dependency.
 */
export function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title: string;
  body: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onCancel();
      }}
      aria-labelledby="confirm-title"
      className="w-[min(28rem,calc(100vw-2rem))] rounded-card border border-line bg-surface p-0 text-body backdrop:bg-black/45"
    >
      <div className="p-6">
        <h2 id="confirm-title" className="text-lg">
          {title}
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-body">{body}</p>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Working" : confirmLabel}
          </Button>
        </div>
      </div>
    </dialog>
  );
}
