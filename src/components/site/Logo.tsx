import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Wordmark by default. Once a logo file is uploaded in Admin -> Media it is
 * rendered in place of the wordmark automatically.
 */
export function Logo({
  logoUrl,
  onBand = false,
}: {
  logoUrl?: string;
  onBand?: boolean;
}) {
  const label = site.name;

  return (
    <Link
      href="/"
      aria-label={`${label} home`}
      className="inline-flex items-center gap-2.5"
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={label}
          width={168}
          height={40}
          priority
          className="h-9 w-auto object-contain"
        />
      ) : (
        <span className="flex flex-col leading-none">
          <span
            className={
              onBand
                ? "text-[17px] font-semibold tracking-tight text-band-text"
                : "text-[17px] font-semibold tracking-tight text-strong"
            }
          >
            Ropana
          </span>
          <span
            className={
              onBand
                ? "mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-band-muted"
                : "mt-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-brand"
            }
          >
            Wound Care
          </span>
        </span>
      )}
    </Link>
  );
}
