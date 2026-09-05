import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * The one inverted colour block on the page. Used once, at the close.
 */
export function CtaBand({
  heading = "Ready to start treatment?",
  body = "Request a mobile visit or a telehealth consultation. We will contact you to confirm availability.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section aria-labelledby="cta-heading" className="bg-band">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <h2
              id="cta-heading"
              className="text-3xl leading-[1.12] text-band-text md:text-4xl"
            >
              {heading}
            </h2>
            <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-band-muted">
              {body}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:col-span-5 lg:justify-end">
            <ButtonLink href="/booking" variant="onBand" size="lg">
              Book a Visit
            </ButtonLink>
            <a
              href={site.phoneHref}
              className="inline-flex h-13 items-center justify-center rounded-control border border-band-line px-6 text-base font-medium text-band-text transition-colors duration-200 hover:bg-white/10"
            >
              Call {site.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
