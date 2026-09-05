import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export function EmptyState({
  title,
  body,
  action,
  className,
}: {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-dashed border-line-strong bg-surface-2 px-6 py-14 text-center",
        className
      )}
    >
      <p className="text-base font-medium text-strong">{title}</p>
      <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-relaxed text-muted">
        {body}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function ErrorNotice({
  title = "We could not load this right now",
  body,
  action,
}: {
  title?: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="rounded-card border border-line-strong bg-danger-soft px-6 py-8 text-center"
    >
      <p className="text-base font-medium text-strong">{title}</p>
      <p className="mx-auto mt-2 max-w-[52ch] text-sm leading-relaxed text-body">
        {body}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Skeleton block shaped like the content it replaces, not a spinner. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cx(
        "animate-pulse rounded-card bg-surface-3",
        className
      )}
    />
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx(
        "inline-block size-4 animate-spin rounded-full border-2 border-current border-r-transparent",
        className
      )}
    />
  );
}
