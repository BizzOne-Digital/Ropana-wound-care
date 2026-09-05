import { ButtonLink } from "@/components/ui/Button";

/**
 * Segment-level not-found boundary. Without one in this segment, notFound()
 * rendered the root boundary but the response went out with HTTP 200, which
 * search engines read as a soft 404.
 */
export default function ServiceNotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <h1 className="max-w-[24ch] text-3xl leading-[1.12] md:text-4xl">
        We could not find that service
      </h1>
      <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-body">
        It may have been renamed or is no longer offered. Here is everything we
        currently provide.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/services" size="lg">
          All services
        </ButtonLink>
        <ButtonLink href="/contact" size="lg" variant="secondary">
          Contact Us
        </ButtonLink>
      </div>
    </div>
  );
}
