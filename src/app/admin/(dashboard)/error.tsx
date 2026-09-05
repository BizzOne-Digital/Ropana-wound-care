"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error.digest ?? error.message);
  }, [error]);

  return (
    <div className="rounded-card border border-line bg-surface p-8">
      <h1 className="text-xl">This page could not load</h1>
      <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-body">
        The most common cause is a database connection problem. Check that
        MONGODB_URI is set and that this server&rsquo;s IP address is allowed in
        your MongoDB Atlas network access list.
      </p>
      <Button onClick={reset} className="mt-6">
        Try again
      </Button>
      {error.digest ? (
        <p className="mt-6 text-[13px] text-muted">Reference: {error.digest}</p>
      ) : null}
    </div>
  );
}
