import { ButtonLink } from "@/components/ui/Button";
import { Section, SectionHeading, Lede } from "@/components/ui/Section";
import { EmptyState, ErrorNotice } from "@/components/ui/States";
import { Rating } from "@/components/ui/Rating";
import { Reveal } from "@/components/ui/Reveal";
import type { TestimonialDTO } from "@/lib/content";

export function TestimonialsSection({
  testimonials,
  showHeading = true,
}: {
  testimonials: TestimonialDTO[] | null;
  showHeading?: boolean;
}) {
  const list = testimonials ?? [];

  return (
    <Section labelledBy="testimonials-heading">
      {showHeading ? (
        <div className="max-w-[52ch]">
          <SectionHeading id="testimonials-heading">
            In patients&rsquo; words
          </SectionHeading>
          <Lede className="mt-4 text-body">
            Feedback shared with us by patients and their families.
          </Lede>
        </div>
      ) : null}

      <div className="mt-10">
        {testimonials === null ? (
          <ErrorNotice body="Patient feedback is temporarily unavailable. Please try again shortly." />
        ) : list.length === 0 ? (
          <EmptyState
            title="No testimonials published yet"
            body="Patient feedback is added and published from the admin dashboard. Once a testimonial is published it appears here automatically."
            action={
              <ButtonLink href="/contact" variant="secondary" size="sm">
                Share your experience
              </ButtonLink>
            }
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((t, i) => (
              <Reveal key={t._id} delay={i * 0.05} className="h-full">
                <figure className="flex h-full flex-col rounded-card border border-line bg-surface p-6">
                  <Rating value={t.rating} />
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-body">
                    &ldquo;{t.content}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4">
                    <span className="block text-[15px] font-medium text-strong">
                      {t.name}
                    </span>
                    {t.location ? (
                      <span className="mt-0.5 block text-[13px] text-muted">
                        {t.location}
                      </span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}
