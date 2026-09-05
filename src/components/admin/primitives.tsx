import type { ReactNode } from "react";
import { cx } from "@/lib/format";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl md:text-[1.75rem]">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-body">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-card border border-line bg-surface p-5 md:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  detail,
  emphasis = false,
}: {
  label: string;
  value: number | string;
  detail?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cx(
        "rounded-card border p-5",
        emphasis ? "border-brand-soft-strong bg-brand-soft" : "border-line bg-surface"
      )}
    >
      <p className="text-[13px] font-medium text-body">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-strong tabular-nums">
        {value}
      </p>
      {detail ? <p className="mt-1 text-[13px] text-muted">{detail}</p> : null}
    </div>
  );
}

const statusTones: Record<string, string> = {
  new: "bg-brand-soft text-brand border-brand-soft-strong",
  pending: "bg-warning-soft text-warning border-warning-soft",
  contacted: "bg-surface-3 text-body border-line",
  confirmed: "bg-success-soft text-success border-success-soft",
  completed: "bg-success-soft text-success border-success-soft",
  resolved: "bg-success-soft text-success border-success-soft",
  cancelled: "bg-danger-soft text-danger border-danger-soft",
  published: "bg-success-soft text-success border-success-soft",
  draft: "bg-surface-3 text-muted border-line",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-pill border px-2.5 py-1 text-[12px] font-medium capitalize",
        statusTones[status] ?? "bg-surface-3 text-body border-line"
      )}
    >
      {status}
    </span>
  );
}
