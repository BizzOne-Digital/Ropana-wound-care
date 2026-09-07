import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Section, SectionHeading, Lede } from "@/components/ui/Section";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { conditionGroups } from "@/lib/site";

/**
 * The practice's fixed clinical scope, grouped into chronic and acute care.
 * Static by design: unlike the service listings, this list is not editable
 * from the admin dashboard.
 */
export function ConditionsTreated({
  tone = "tinted",
}: {
  tone?: "default" | "tinted";
}) {
  return (
    <Section tone={tone} labelledBy="conditions-heading" id="conditions">
      <div>
        <SectionHeading id="conditions-heading">Our services</SectionHeading>
        <Lede className="mt-4 text-body">
          Comprehensive evaluation and ongoing management for both chronic and
          acute wounds.
        </Lede>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {conditionGroups.map((group, i) => (
          <Reveal key={group.title} delay={i * 0.05} className="h-full">
            <div className="h-full rounded-card border border-line bg-surface p-6 md:p-8">
              <Icon name={group.icon} size={26} className="text-brand" />
              <h3 className="mt-4 text-[19px] font-semibold text-strong">
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {group.conditions.map((condition) => (
                  <li
                    key={condition}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-body"
                  >
                    <CheckCircle
                      size={18}
                      weight="duotone"
                      className="mt-0.5 shrink-0 text-brand"
                      aria-hidden
                    />
                    {condition}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
