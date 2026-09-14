import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ContentImage } from "@/components/ui/ContentImage";
import { PLACEHOLDER, type ServiceDTO } from "@/lib/content";

export function ServiceCard({ service }: { service: ServiceDTO }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors duration-200 hover:border-line-strong">
      <ContentImage
        src={service.image}
        designFallback={PLACEHOLDER.service}
        alt=""
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
        className="aspect-[16/10] w-full"
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg leading-snug">{service.title}</h3>
        <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-body">
          {service.shortDescription}
        </p>
        <Link
          href={`/services/${service.slug}`}
          className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand transition-colors hover:text-brand-hover"
        >
          Learn more
          <span className="sr-only"> about {service.title}</span>
          <ArrowRight
            size={16}
            aria-hidden
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </Link>
      </div>
    </article>
  );
}
