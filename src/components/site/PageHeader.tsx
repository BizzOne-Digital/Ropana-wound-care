import type { ReactNode } from "react";

export function PageHeader({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-surface-2">
      <div className="container-page py-14 md:py-20">
        <h1 className="max-w-[20ch] text-4xl leading-[1.1] md:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-[62ch] text-[17px] leading-relaxed text-body">
            {intro}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}
