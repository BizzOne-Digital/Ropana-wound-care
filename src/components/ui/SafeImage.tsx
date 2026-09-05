import Image, { type ImageProps } from "next/image";
import { PLACEHOLDER_IMAGE_SRC, resolveImageSrc } from "@/lib/uploads";

type SafeImageProps = Omit<ImageProps, "src"> & {
  src: string | null | undefined;
  /**
   * Stand-in photography to show while the client's own image is outstanding.
   * When omitted, a missing image falls back to the neutral placeholder.
   */
  designFallback?: string;
};

/**
 * next/image wrapper that keeps a missing or stale image from rendering broken.
 *
 * Legacy `/uploads/...` paths pointed at the local disk and no longer resolve on
 * a serverless host, so they degrade to the placeholder. The placeholder itself
 * is an SVG and skips the image optimiser, which means no `dangerouslyAllowSVG`
 * is needed anywhere in the project.
 */
export function SafeImage({
  src,
  designFallback,
  alt,
  ...rest
}: SafeImageProps) {
  const resolved = resolveImageSrc(src, designFallback);
  const isPlaceholder = resolved === PLACEHOLDER_IMAGE_SRC;

  return (
    <Image
      src={resolved}
      alt={alt}
      unoptimized={isPlaceholder}
      {...rest}
    />
  );
}
