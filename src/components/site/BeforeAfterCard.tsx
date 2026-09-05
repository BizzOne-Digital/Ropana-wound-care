"use client";

import { useState } from "react";
import { Eye } from "@phosphor-icons/react/dist/ssr";
import { SafeImage } from "@/components/ui/SafeImage";
import { cx } from "@/lib/format";
import type { WoundCaseDTO } from "@/lib/content";

function Frame({
  src,
  alt,
  label,
  blurred,
}: {
  src: string;
  alt: string;
  label: string;
  blurred: boolean;
}) {
  return (
    <figure className="relative m-0">
      <div className="relative aspect-square overflow-hidden rounded-control bg-surface-3">
        <SafeImage
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 40vw, 44vw"
          className={cx(
            "object-cover transition-[filter,transform] duration-500",
            // scale-105 hides the soft edge blur leaves at the frame border
            blurred && "scale-105 blur-xl"
          )}
        />
      </div>
      <figcaption className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </figcaption>
    </figure>
  );
}

export function BeforeAfterCard({ item }: { item: WoundCaseDTO }) {
  const [revealed, setRevealed] = useState(false);
  const hidden = item.sensitive && !revealed;
  const panelId = `case-images-${item._id}`;

  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-surface p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[17px] font-semibold text-strong">{item.title}</h3>
        {item.timeframe ? (
          <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1 text-[12px] font-medium text-accent">
            {item.timeframe}
          </span>
        ) : null}
      </div>

      <div className="relative mt-5">
        <div
          id={panelId}
          className="grid grid-cols-2 gap-3"
          // The images stay in the DOM so the blur can transition, but they are
          // taken out of the reading order until the visitor opts in.
          aria-hidden={hidden}
        >
          <Frame
            src={item.beforeImage}
            alt={hidden ? "" : `${item.title}, before treatment`}
            label="Before"
            blurred={hidden}
          />
          <Frame
            src={item.afterImage}
            alt={hidden ? "" : `${item.title}, after treatment`}
            label="After"
            blurred={hidden}
          />
        </div>

        {hidden ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-control bg-surface/70 p-4 text-center backdrop-blur-[2px]">
            <p className="text-[13px] leading-relaxed text-body">
              Contains clinical wound images.
            </p>
            <button
              type="button"
              onClick={() => setRevealed(true)}
              aria-expanded={false}
              aria-controls={panelId}
              className="inline-flex items-center gap-2 rounded-control bg-brand px-4 py-2 text-[14px] font-medium text-brand-fg transition-colors hover:bg-brand-hover"
            >
              <Eye size={16} aria-hidden />
              View images
            </button>
          </div>
        ) : null}
      </div>

      {item.summary ? (
        <p className="mt-5 flex-1 text-[14px] leading-relaxed text-body">
          {item.summary}
        </p>
      ) : null}
    </article>
  );
}
