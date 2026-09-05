"use client";

import { useMemo, useState } from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import type { FaqDTO } from "@/lib/content";
import { EmptyState } from "@/components/ui/States";
import { cx } from "@/lib/format";

/**
 * Accessible disclosure list. Uses native <details>/<summary> so it works
 * with keyboard, screen readers and without JavaScript; search is progressive
 * enhancement on top.
 */
export function FaqAccordion({
  faqs,
  searchable = false,
}: {
  faqs: FaqDTO[];
  searchable?: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqs, query]);

  return (
    <div>
      {searchable ? (
        <div className="relative mb-8 max-w-md">
          <label htmlFor="faq-search" className="sr-only">
            Search questions
          </label>
          <MagnifyingGlass
            size={18}
            aria-hidden
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="faq-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions"
            className="h-11 w-full rounded-control border border-line-strong bg-surface pl-10 pr-3.5 text-[15px] text-strong placeholder:text-muted focus:border-brand focus:outline-none"
          />
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState
          title="No matching questions"
          body={
            query
              ? "Try a different search term, or contact us and we will answer directly."
              : "Questions are added and published from the admin dashboard."
          }
        />
      ) : (
        <div className="divide-y divide-line border-y border-line">
          {filtered.map((faq) => (
            <details key={faq._id} className="group py-1">
              <summary
                className={cx(
                  "flex cursor-pointer list-none items-start justify-between gap-6 py-4 text-left",
                  "text-[16px] font-medium text-strong transition-colors hover:text-brand",
                  "[&::-webkit-details-marker]:hidden"
                )}
              >
                <span>{faq.question}</span>
                <CaretDown
                  size={18}
                  aria-hidden
                  className="mt-1 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <div className="pb-5 pr-8 text-[15px] leading-relaxed text-body">
                {faq.answer.split("\n").map((para, i) => (
                  <p key={i} className={i > 0 ? "mt-3" : undefined}>
                    {para}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
