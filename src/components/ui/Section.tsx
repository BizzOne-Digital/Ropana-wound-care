import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/format";

type Tone = "default" | "tinted" | "band";

const tones: Record<Tone, string> = {
  default: "bg-surface",
  tinted: "bg-surface-2",
  band: "bg-band text-band-muted",
};

export function Section({
  children,
  tone = "default",
  className,
  id,
  as: Tag = "section",
  labelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  as?: ElementType;
  labelledBy?: string;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      className={cx("py-16 md:py-24", tones[tone], className)}
    >
      <div className="container-page">{children}</div>
    </Tag>
  );
}

/** Small uppercase label above a section heading. Rationed site-wide. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
      {children}
    </p>
  );
}

export function SectionHeading({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cx(
        "text-3xl leading-[1.12] md:text-4xl lg:text-[2.75rem]",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Lede({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cx("max-w-[62ch] text-[17px] leading-relaxed", className)}>
      {children}
    </p>
  );
}
