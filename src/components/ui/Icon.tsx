import {
  Bandaids,
  BookOpenText,
  CalendarCheck,
  Certificate,
  ClipboardText,
  HeartStraight,
  Van,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/**
 * One icon family for the whole project (Phosphor), imported from the SSR
 * entry point so marketing pages stay Server Components.
 */
const registry: Record<string, PhosphorIcon> = {
  certificate: Certificate,
  bandaids: Bandaids,
  van: Van,
  video: VideoCamera,
  clipboard: ClipboardText,
  book: BookOpenText,
  calendar: CalendarCheck,
  heart: HeartStraight,
};

export function Icon({
  name,
  className,
  size = 22,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = registry[name] ?? Certificate;
  return <Cmp size={size} weight="duotone" className={className} aria-hidden />;
}
