import { Icon } from "@/components/ui/Icon";
import { trustPoints } from "@/lib/site";

/** Credential row. Sits below the hero, never inside it. */
export function TrustStrip() {
  return (
    <section
      aria-label="Practice credentials"
      className="overflow-hidden border-y border-line bg-surface-2"
    >
      <div className="trust-marquee-track flex w-max">
        {[0, 1].map((track) => (
          <ul
            key={track}
            aria-hidden={track === 1}
            className="flex shrink-0"
          >
            {trustPoints.map((point) => (
              <li
                key={`${track}-${point.label}`}
                className="flex shrink-0 items-center gap-3 border-r border-line px-8 py-5 first:border-l sm:px-12"
              >
                <Icon name={point.icon} className="shrink-0 text-brand" size={20} />
                <span className="whitespace-nowrap text-[13px] font-medium text-strong">
                  {point.label}
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}
