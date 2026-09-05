import type { ReactNode } from "react";

const pageHeaderImages = [
  "/images/feet1.jpg",
  "/images/feet3.jpg",
  "/images/feet5.jpg",
  "/images/feet6.jpg",
];

export function PageHeader({
  title,
  intro,
  children,
  image,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
  image?: string;
}) {
  const imageIndex = title.length % pageHeaderImages.length;
  const backgroundImage = image ?? pageHeaderImages[imageIndex];

  return (
    <section
      className="relative isolate overflow-hidden border-b border-line bg-band"
      style={{
        backgroundImage: `url("${backgroundImage}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/60" />
      <div className="container-page relative py-14 md:py-20">
        <h1 className="max-w-[20ch] text-4xl leading-[1.1] text-white md:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-white/85">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
