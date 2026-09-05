"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // The digest is the only safe identifier to surface; never render a stack.
    console.error("[site error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-20">
      <h1 className="max-w-[22ch] text-3xl leading-[1.12] md:text-4xl">
        Something went wrong on this page
      </h1>
      <p className="mt-4 max-w-[54ch] text-[16px] leading-relaxed text-body">
        This is on our end, not yours. Try again, or call us and we will help
        directly.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={reset} size="lg">
          Try again
        </Button>
        <ButtonLink href={site.phoneHref} size="lg" variant="secondary">
          Call {site.phoneDisplay}
        </ButtonLink>
      </div>

      {error.digest ? (
        <p className="mt-8 text-[13px] text-muted">
          Reference: {error.digest}
        </p>
      ) : null}
    </div>
  );
}
