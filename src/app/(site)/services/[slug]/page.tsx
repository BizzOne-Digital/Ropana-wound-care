import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/Section";
import { SafeImage } from "@/components/ui/SafeImage";
import { CtaBand } from "@/components/site/CtaBand";
import { ServiceCard } from "@/components/site/ServiceCard";
import {
  PLACEHOLDER,
  getPublishedServices,
  getServiceBySlug,
} from "@/lib/content";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/**
 * Rendered per request rather than statically.
 *
 * Services are created and deleted from the admin dashboard at any time. With
 * static generation, Next cached the notFound() result for an unknown slug as a
 * successful prerender: HTTP 200 with not-found content, held under
 * `Cache-Control: s-maxage=31536000`. That is a soft 404 to search engines, and
 * it would also serve stale not-found content if a service were later created
 * at that slug. Dynamic rendering returns a true 404 and keeps the page in step
 * with the database.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) return { title: "Service not found" };

  return {
    title: service.title,
    description: service.shortDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | ${site.name}`,
      description: service.shortDescription,
      images: service.image ? [service.image] : undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, all] = await Promise.all([
    getServiceBySlug(slug),
    getPublishedServices(),
  ]);

  if (!service) notFound();

  const related = (all ?? []).filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <div className="border-b border-line bg-surface-2">
        <div className="container-page py-14 md:py-20">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-[14px] font-medium text-body transition-colors hover:text-brand"
          >
            <ArrowLeft size={15} aria-hidden />
            All services
          </Link>

          <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-7">
              <h1 className="text-4xl leading-[1.1] md:text-5xl">
                {service.title}
              </h1>
              <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-body">
                {service.shortDescription}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={`/booking?service=${encodeURIComponent(service.title)}`}
                  size="lg"
                >
                  Book a Visit
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="secondary">
                  Contact Us
                </ButtonLink>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card border border-line">
                <SafeImage
                  src={service.image}
                  designFallback={PLACEHOLDER.service}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex max-w-[68ch] flex-col gap-4 text-[16px] leading-relaxed text-body">
              {service.description
                .split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
            </div>
          </div>

          {service.features.length > 0 ? (
            <aside className="lg:col-span-5">
              <div className="rounded-card border border-line bg-surface-2 p-6">
                <h2 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-strong">
                  What this includes
                </h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        size={16}
                        weight="bold"
                        aria-hidden
                        className="mt-1 shrink-0 text-brand"
                      />
                      <span className="text-[15px] leading-relaxed text-body">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          ) : null}
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="tinted" labelledBy="related-heading">
          <h2 id="related-heading" className="text-2xl md:text-3xl">
            Other services
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
