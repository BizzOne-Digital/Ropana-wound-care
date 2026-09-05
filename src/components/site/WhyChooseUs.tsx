import { Icon } from "@/components/ui/Icon";
import { Section, SectionHeading, Lede } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { differentiators } from "@/lib/site";
import { cx } from "@/lib/format";

/**
 * Bento grid: exactly eight cells for the eight client-supplied selling
 * points, with deliberate size and surface variation so it does not read as
 * a row of identical cards.
 */
const cells = [
  { span: "lg:col-span-3", tone: "brand" },
  { span: "lg:col-span-3", tone: "plain" },
  { span: "lg:col-span-2", tone: "plain" },
  { span: "lg:col-span-2", tone: "muted" },
  { span: "lg:col-span-2", tone: "plain" },
  { span: "lg:col-span-3", tone: "plain" },
  { span: "lg:col-span-3", tone: "muted" },
  { span: "lg:col-span-6", tone: "brand" },
] as const;

const tones = {
  brand: "bg-brand-soft border-brand-soft-strong",
  muted: "bg-surface-3 border-line",
  plain: "bg-surface border-line",
} as const;

export function WhyChooseUs() {
  return (
    <Section tone="tinted" labelledBy="why-heading">
      <div className="max-w-[52ch]">
        <SectionHeading id="why-heading">Why patients choose us</SectionHeading>
        <Lede className="mt-4 text-body">
          Clinical expertise and practical convenience, without the trip to a
          clinic.
        </Lede>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {differentiators.map((item, i) => {
          const cell = cells[i] ?? cells[cells.length - 1];
          const wide = cell.span === "lg:col-span-6";
          return (
            <Reveal
              key={item.title}
              delay={i * 0.04}
              className={cx("h-full", cell.span)}
            >
              <div
                className={cx(
                  "flex h-full flex-col rounded-card border p-6",
                  tones[cell.tone],
                  wide && "lg:flex-row lg:items-center lg:gap-6"
                )}
              >
                <Icon name={item.icon} size={26} className="text-brand" />
                <div className={cx("mt-4", wide && "lg:mt-0")}>
                  <h3 className="text-[15px] font-semibold leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-body">
                    {item.body}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
