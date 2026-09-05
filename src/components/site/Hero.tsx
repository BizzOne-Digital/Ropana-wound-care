import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[540px] items-center overflow-hidden bg-band py-20 md:min-h-[640px] md:py-28">
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        loop
        muted
        playsInline
      >
        <source src="/vid/vid4.mp4" type="video/mp4" />
      </video>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/55" />

      <div className="container-page relative">
        <div className="max-w-2xl">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              {site.name}
            </p>

            <h1 className="mt-5 text-[2.4rem] leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Expert wound care, delivered to you.
            </h1>

            <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-white/85">
              Board-certified wound care at your home, or by telehealth, across
              the Dallas-Fort Worth area.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/booking" size="lg">
                Book a Visit
              </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="secondary">
                Contact Us
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
