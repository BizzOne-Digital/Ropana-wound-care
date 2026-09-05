import { MapPin } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/site";

export function ServiceArea() {
  return (
    <section aria-label="Service area" className="border-y border-line bg-surface">
      <div className="container-page flex flex-col items-start gap-4 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MapPin size={22} weight="duotone" className="text-brand" aria-hidden />
          <p className="text-[16px] font-medium text-strong">
            Serving the {site.serviceAreaLong}
          </p>
        </div>
        <p className="text-[15px] text-body">
          Not sure if we reach you?{" "}
          <a
            href={site.phoneHref}
            className="font-medium text-brand underline underline-offset-4"
          >
            Call {site.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  );
}
