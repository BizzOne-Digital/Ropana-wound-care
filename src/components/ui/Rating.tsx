import { Star } from "@phosphor-icons/react/dist/ssr";

export function Rating({ value }: { value: number | null | undefined }) {
  if (!value) return null;
  const rounded = Math.max(1, Math.min(5, Math.round(value)));
  return (
    <div
      className="flex items-center gap-0.5 text-brand"
      role="img"
      aria-label={`Rated ${rounded} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={15}
          weight={i < rounded ? "fill" : "regular"}
          className={i < rounded ? "" : "text-line-strong"}
          aria-hidden
        />
      ))}
    </div>
  );
}
