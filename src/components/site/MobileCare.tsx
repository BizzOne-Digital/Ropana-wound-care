import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const points = [
  {
    title: "Care where you are",
    body: "Assessment, dressing changes and treatment carried out in your own home.",
  },
  {
    title: "Less travel for you",
    body: "No transport to arrange and no waiting room, which matters when mobility is limited.",
  },
  {
    title: "A plan built around you",
    body: "Your wound, your health history and your daily routine shape the treatment plan.",
  },
  {
    title: "Continuity between visits",
    body: "The same clinician follows your progress and adjusts the plan as it changes.",
  },
];

export function MobileCare({ imageUrl }: { imageUrl: string }) {
  return (
    <Section tone="tinted" labelledBy="mobile-care-heading">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line">
            {/* TODO(client): replace with a real mobile visit photograph. */}
            <Image
              src={imageUrl}
              alt="A clinician arriving at a patient's home for a scheduled wound care visit"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <Eyebrow>Mobile visits</Eyebrow>
          <SectionHeading id="mobile-care-heading">
            Wound care that comes to your door
          </SectionHeading>
          <p className="mt-4 max-w-[58ch] text-[17px] leading-relaxed text-body">
            Getting to an appointment is often the hardest part of wound care.
            Mobile visits remove that step, so treatment stays consistent.
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {points.map((point, i) => (
              <Reveal key={point.title} delay={i * 0.05}>
                <dt className="text-[15px] font-semibold text-strong">
                  {point.title}
                </dt>
                <dd className="mt-1.5 text-[15px] leading-relaxed text-body">
                  {point.body}
                </dd>
              </Reveal>
            ))}
          </dl>

          <ButtonLink href="/booking" className="mt-9">
            Book a Visit
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
