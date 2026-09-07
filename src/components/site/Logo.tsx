import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { cx } from "@/lib/format";

/**
 * Brand lockup.
 *
 * The client logo (/public/Logo/logo.png) was split into two transparent
 * assets: the R-monogram mark and the wordmark. At header size the full
 * stacked lockup is unreadable, so we render the mark as an image and set
 * the wordmark in type using brand tokens - which also keeps it legible on
 * the dark theme and on the inverted CTA band, where the navy artwork would
 * disappear.
 *
 * If a logo is uploaded in Admin -> Media it replaces the whole lockup.
 */
export function Logo({
  logoUrl,
  onBand = false,
  size = "md",
}: {
  logoUrl?: string;
  onBand?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const label = site.name;
  const markPx = size === "xl" ? 64 : size === "lg" ? 48 : 38;

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
          className={
            size === "xl"
              ? "h-16 w-auto object-contain"
              : size === "lg"
                ? "h-12 w-auto object-contain"
                : "h-10 w-auto object-contain"
          }
        />
      ) : (
        <>
          <BrandMark px={markPx} onBand={onBand} priority />
          <span className="flex flex-col leading-none">
            <span
              className={cx(
                "font-serif font-semibold uppercase",
                size === "xl"
                  ? "text-[28px] tracking-[0.12em]"
                  : size === "lg"
                    ? "text-[24px] tracking-[0.11em]"
                    : "text-[19px] tracking-[0.1em]",
                onBand ? "text-band-text" : "text-brand"
              )}
            >
              Ropana
            </span>
            <span
              className={cx(
                "mt-1 font-medium uppercase",
                size === "xl"
                  ? "text-[13px] tracking-[0.32em]"
                  : size === "lg"
                    ? "text-[11px] tracking-[0.3em]"
                    : "text-[9px] tracking-[0.28em]",
                onBand ? "text-band-muted" : "text-accent"
              )}
            >
              Wound Care
            </span>
          </span>
        </>
      )}
    </Link>
  );
}

/**
 * The R-monogram. The artwork is navy, which disappears on a dark ground, so
 * a lightened variant is swapped in for the dark theme and for the inverted
 * CTA band. Both files are generated from the same source logo.
 */
export function BrandMark({
  px,
  onBand = false,
  priority = false,
  className,
}: {
  px: number;
  onBand?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const common = {
    width: 215,
    height: 215,
    priority,
    style: { height: px },
  } as const;

  if (onBand) {
    return (
      <Image
        {...common}
        alt=""
        src="/Logo/mark-dark.png"
        className={cx("w-auto shrink-0 object-contain", className)}
      />
    );
  }

  return (
    <>
      <Image
        {...common}
        alt=""
        src="/Logo/mark.png"
        className={cx("w-auto shrink-0 object-contain dark:hidden", className)}
      />
      <Image
        {...common}
        alt=""
        src="/Logo/mark-dark.png"
        className={cx(
          "hidden w-auto shrink-0 object-contain dark:block",
          className
        )}
      />
    </>
  );
}
