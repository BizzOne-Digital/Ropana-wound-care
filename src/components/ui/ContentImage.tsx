import { SafeImage } from "@/components/ui/SafeImage";
import { cx } from "@/lib/format";

type ContentImageProps = {
  src: string | null | undefined;
  alt: string;
  /** Seeded stand-in used while the client's own image is outstanding. */
  designFallback?: string;
  sizes: string;
  priority?: boolean;
  /** Frame classes: aspect ratio, width, radius and border. */
  className?: string;
  /** Extra classes on the image itself, for transitions and filters. */
  imageClassName?: string;
};

/**
 * The single renderer for admin-uploaded imagery.
 *
 * Uploads arrive at whatever aspect ratio the client's camera or scanner
 * produced, so the frame keeps a fixed ratio for layout, and the image is
 * contained and centred inside it rather than cropped to fill. Nothing is cut
 * off and nothing is stretched; any difference between the upload's ratio and
 * the frame's shows as a neutral surface mat on either side.
 *
 * Hero and page-header artwork is deliberately not routed through here - that
 * imagery is chosen to bleed edge to edge behind text.
 */
export function ContentImage({
  src,
  alt,
  designFallback,
  sizes,
  priority,
  className,
  imageClassName,
}: ContentImageProps) {
  return (
    <div className={cx("relative overflow-hidden bg-surface-3", className)}>
      <SafeImage
        src={src}
        designFallback={designFallback}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cx("object-contain object-center", imageClassName)}
      />
    </div>
  );
}
